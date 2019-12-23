//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';
import '../css/main.css';
import '../css/mobile.css';

import transparentLoadingGif from '../img/transparentLoading.gif';
import birdsFlying from '../img/bird_flying.png';
import forestBird from '../img/forest_bird.jpg';

window.enableOfflineTesing = true;

const state = {};
window.state = state;

//button press animation starts, wait BS length, button animation is reversed, BS length wait, function starts
function buttonClicked(e, buttonFunction, buttonSpeed) {
    const selectedButton = document
        .getElementById(e.target.id)
        .closest('button');
    return createInterval(
        function() {
            selectedButton.blur(); //removes button focus
            createInterval(
                function() {
                    buttonFunction(e);
                    return clearIntervals('returnFunc');
                },
                'returnFunc',
                buttonSpeed,
            );
            return clearIntervals('btnClick');
        },
        'btnClick',
        buttonSpeed,
    );
}

function menuButtonFunctions() {
    const buttonFnObj = {
        resetDatabase: () => resetDatabasePrompt(),
        fourAnsOneImgBtn: () => startQuiz(1),
        oneAnsFourImgBtn: () => startQuiz(2),
        mixedCountdownQuizBtn: () => startQuiz(3),
    };

    //Assigns nav btn funcs to buttonFnObj
    [...document.querySelectorAll('.menu .navBtn')].forEach(function(button) {
        buttonFnObj[button.id] = () => view.setToScreen(button.value);
    });

    return buttonFnObj;
}

function setUpButtonBounce(buttonFunctions, btnClass, buttonSpeed) {
    addButtonsTransitionSpeed(btnClass, buttonSpeed);
    addButtonClickedEventListeners(buttonFunctions, buttonSpeed);
}

function addButtonsTransitionSpeed(btnClass, buttonSpeed) {
    const classBtns = [].slice.call(
        document.querySelectorAll(
            `${btnClass} .buttonContainer:not(.answerButtonsContainer) button`,
        ),
    );
    classBtns.map(el => (el.style.transition = `${buttonSpeed / 1250}s`));
}

function addButtonClickedEventListeners(buttonFunctions, buttonSpeed) {
    for (var button in buttonFunctions) {
        const buttonFunction = buttonFunctions[button];
        document.getElementById(button).addEventListener(
            'focus',
            e =>
                buttonClicked(
                    e,

                    e => buttonFunction(e),

                    buttonSpeed,
                ),
            true,
        );
    }
}

setUpButtonBounce(menuButtonFunctions(), '.menu', 250);

function resetDatabasePrompt() {
    if (
        confirm(
            'Are you sure you want to reset the database? This will delete the entire ban list as well as all highscores.',
        )
    ) {
        controlGetDatabase();
    }
}
/////////////////////////

const controlGetDatabase = async () => {
    view.setLoadingScreen('Fetching Database...');
    state.birdQuiz = new Birds();
    try {
        await state.birdQuiz.getBirdList();
        window.localStorage.setItem(
            'localBirdQuizDatabase',
            JSON.stringify(state.birdQuiz),
        );
        console.log('Database retrieved:');
        console.log(state.birdQuiz);
        state.birdQuiz.onload = view.setToScreen('mainMenu');
    } catch (error) {
        console.log(error);
        alert('Something wrong with the search...');
    }
};

const loadLocalDatabase = async () => {
    try {
        state.birdQuiz = await JSON.parse(
            window.localStorage.getItem('localBirdQuizDatabase'),
        );
        state.birdQuiz.__proto__ = new Birds().__proto__;
        console.log('Local database loaded:');
        console.log(state.birdQuiz);
    } catch (error) {
        console.log(error);
    }
};

window.addEventListener('load', () => {
    if (localStorage.localBirdQuizDatabase) {
        loadLocalDatabase();
    } else {
        alert('No local database found. Contacting API.');
        controlGetDatabase();
    }
});

const startQuiz = async quizNumber => {
    function quizButtonFunctions() {
        const buttonFnObj = {
            banImageBtn: () => manualAddToBanList(),
            banReturnBtn: () => cancelBan(),
            cancelBanBtn: () => cancelBan(),
            confirmBanBtn: () => confirmBan(),
        };

        [...document.querySelectorAll('.quiz .quitBtn')].forEach(function(
            button,
        ) {
            buttonFnObj[button.id] = function _listener() {
                quitQuiz();
                button.removeEventListener('click', _listener, true);
            };
        });

        return buttonFnObj;
    }
    state.currentQuiz = new Object();

    //Add answer button event listeners, not made using bounce button function as answer needs to be immediate
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.addEventListener('click', buttonSelected, false);
    });

    function initQuiz(quizNumber) {
        setUpButtonBounce(quizButtonFunctions(), '.quiz', 175);
        state.currentQuiz.score = 0;
        state.currentQuiz.questionNumber = 1;
        state.currentQuiz.totalQuestions = 10;
        state.currentQuiz.answerButtonFunction = quizAnswerClicked;
        view.setLoadingScreen('Loading Quiz...');
        switch (quizNumber) {
            case 1:
                view.setTimerState(false);
                state.currentQuiz.quizFunction = fourAnswerQuizQuestion;
                state.currentQuiz.quizNumber = 1;
                break;
            case 2:
                view.setTimerState(false);
                state.currentQuiz.quizFunction = fourImageQuizQuestion;
                state.currentQuiz.quizNumber = 2;
                break;
            case 3:
                view.setTimerState(true);
                state.currentQuiz.quizFunction = mixedCountdownQuiz;
                state.currentQuiz.quizNumber = randomIntBetweenTwoValues(3, 4);
                break;
            default:
                break;
        }
        return state.currentQuiz.quizFunction();
    }

    const fourAnswerQuizQuestion = async () => {
        view.setQuizScreen('quizOne');
        const [birdsObjArr, chosenBird] = loadQuestionVariables();
        try {
            const birdPhoto = await state.birdQuiz.getBirdPhoto(
                chosenBird,
                quitQuiz,
            );
            state.currentQuiz.photos = [birdPhoto];
            await view.fourNameNewQuestionUI(
                birdPhoto,
                birdsObjArr,
                state.currentQuiz.score,
                state.currentQuiz.questionNumber,
                state.currentQuiz.totalQuestions,
            );
            await view.setToScreen('quizScreen');
        } catch {
            return state.birdQuiz.pingWikipedia(
                fourAnswerQuizQuestion,
                quitQuiz,
            );
        }
    };

    const fourImageQuizQuestion = async () => {
        view.setQuizScreen('quizTwo');
        const [birdsObjArr, chosenBird] = loadQuestionVariables();
        try {
            const birdPhotoArray = await getBirdPhotos(birdsObjArr);
            state.currentQuiz.photos = birdPhotoArray;
            await view.fourImgNewQuestionUI(
                birdPhotoArray,
                chosenBird,
                state.currentQuiz.score,
                state.currentQuiz.questionNumber,
                state.currentQuiz.totalQuestions,
            );
            await view.setToScreen('quizScreen');
        } catch {
            return state.birdQuiz.pingWikipedia(
                fourImageQuizQuestion,
                quitQuiz,
            );
        }
    };

    const mixedCountdownQuiz = async () => {
        view.setLoadingScreen('Generating New Question...');
        const rand = randomIntBetweenTwoValues(1, 2);
        switch (rand) {
            case 1:
                state.currentQuiz.quizNumber = 3;
                await fourAnswerQuizQuestion();
                break;
            case 2:
                state.currentQuiz.quizNumber = 4;
                await fourImageQuizQuestion();
                break;
        }
        view.setTimerState(true);
        const counter = 1000;
        const mainColor = 'darksalmon';
        const backgroundColor = 'white';
        let i = counter;
        createInterval(
            function() {
                i--;
                const mod = Math.floor(i / (counter / 2) + 1) % 2; //0 first half 1 2nd half
                const cycle = 90 * (mod * 2 - 1) - (360 / counter) * i;
                view.setCountdownState(cycle, mod, mainColor, backgroundColor);
                if (i === 0) {
                    clearIntervals('countdown');
                    state.currentQuiz.score -= 2;
                    showCorrectAnswer();
                    return endQuestion();
                }
            },
            'countdown',
            10,
        );
    };

    function manualAddToBanList() {
        switch (state.currentQuiz.quizNumber) {
            case 1:
            case 3:
                banImgSelected(0);
                break;
            case 2:
            case 4:
                state.currentQuiz.answerButtonFunction = banImgSelected;
                view.setBanSelectionScreen(true);
                view.resetButtons();
                break;
            default:
                break;
        }
    }

    function banImgSelected(i) {
        view.setToScreen('quizBanScreenConfirmation');
        view.setBanImage(state.currentQuiz.photos[i]);
        state.currentQuiz.birdToBan = state.currentQuiz.birdObjArr[i].bird;
    }

    function confirmBan() {
        clearAllIntervals();
        state.birdQuiz.moveBirdToBanList(state.currentQuiz.birdToBan);
        resetFromBanToQuiz();
        view.setLoadingScreen('Generating New Question...');
        state.currentQuiz.quizFunction();
    }

    function cancelBan() {
        resetFromBanToQuiz();
        view.setToScreen('quizScreen');
    }

    function currentButtonStates() {
        const buttonStates = state.currentQuiz.birdObjArr.map(el => {
            if (el.clicked && el.chosen) return 'correct';
            else if (el.clicked && !el.chosen) return 'incorrect';
            else return 'unselected';
        });
        return buttonStates;
    }

    function resetFromBanToQuiz() {
        state.currentQuiz.answerButtonFunction = quizAnswerClicked;
        state.currentQuiz.birdToBan = null;
        view.setAnswerButtonsState(
            currentButtonStates(),
            state.currentQuiz.quizNumber,
        );
    }

    function loadQuestionVariables() {
        const birdsObjArr = getFourBirdArr();
        const chosenBird = birdsObjArr.find(el => el.chosen === true).bird;
        return [birdsObjArr, chosenBird];
    }

    function getFourBirdArr() {
        let birdArray = [...Array(4).keys()].map(
            el =>
                state.birdQuiz.birds[
                    Math.floor(Math.random() * state.birdQuiz.birds.length)
                ],
        );
        let chosenBird = randomIntBetweenTwoValues(0, 3);
        let birdObjArr = [];

        birdArray.forEach(function(el, i) {
            birdObjArr[i] = {
                bird: el,
                chosen: i === chosenBird ? true : false,
                clicked: false,
            };
        });
        state.currentQuiz.birdObjArr = birdObjArr;
        return birdObjArr;
    }

    async function getBirdPhotos(birds) {
        const birdPhotoRequests = await birds.map(
            async el => await state.birdQuiz.getBirdPhoto(el.bird, quitQuiz),
        );
        const birdPhotoArray = await Promise.all(birdPhotoRequests);
        return birdPhotoArray;
    }

    function buttonSelected(evt) {
        const selectedButton = document
            .getElementById(evt.target.id)
            .closest('button');
        const i = selectedButton.id.replace('answer-', '') - 1;
        state.currentQuiz.answerButtonFunction(i);
    }

    function quizAnswerClicked(i) {
        state.currentQuiz.birdObjArr[i].clicked = true;
        view.setAnswerButtonsState(
            currentButtonStates(),
            state.currentQuiz.quizNumber,
        );
        checkAnswerCorrect(i);
    }

    function checkAnswerCorrect(i) {
        state.currentQuiz.birdObjArr[i].chosen
            ? correctAnswer()
            : incorrectAnswer();
        view.updateScore(state.currentQuiz.score);
    }

    function correctAnswer() {
        state.currentQuiz.score += 2;
        endQuestion();
    }

    function endQuestion() {
        clearIntervals('countdown');
        view.updateScore(state.currentQuiz.score);
        view.enableAnswerButtons(false);
        state.currentQuiz.questionNumber++;
        checkIfQuizComplete();
    }

    function incorrectAnswer() {
        if ([1, 2].includes(state.currentQuiz.quizNumber)) {
            const wrongAnswers = state.currentQuiz.birdObjArr.filter(
                el => el.clicked === true,
            ).length;
            //-1 for 1st wrong answer, -2 for 2nd, -3 for 3rd
            state.currentQuiz.score -= wrongAnswers;
        } else {
            state.currentQuiz.score -= 2;

            //make correct answer visible
            showCorrectAnswer();

            endQuestion();
        }
    }

    function showCorrectAnswer() {
        state.currentQuiz.birdObjArr.map(el => {
            if (el.chosen) el.clicked = true;
        });
        view.setAnswerButtonsState(
            currentButtonStates(),
            state.currentQuiz.quizNumber,
        );
    }

    function checkIfQuizComplete() {
        return createInterval(
            function() {
                if (
                    state.currentQuiz.questionNumber >
                    state.currentQuiz.totalQuestions
                ) {
                    quizComplete();
                } else {
                    state.currentQuiz.quizFunction();
                }
                return clearIntervals('pause');
            },
            'pause',
            2000,
        );
    }

    function quizComplete() {
        const roundedPercentageScore = calculateHighscore();
        const highscore = checkIfHighscoreBeaten(roundedPercentageScore);

        view.updateGameCompleteScreen(
            state.currentQuiz.score,
            roundedPercentageScore,
            highscore,
        );
        view.setToScreen('quizCompleteScreen');
    }

    function calculateHighscore() {
        const questions = state.currentQuiz.totalQuestions;
        const score = state.currentQuiz.score;
        if ([1, 2].includes(state.currentQuiz.quizNumber)) {
            state.currentQuiz.scorePercentage =
                (100 * (score + 4 * questions)) / 6 / questions;
        } else {
            state.currentQuiz.scorePercentage =
                (100 * (score + 2 * questions)) / 4 / questions;
        }
        let roundedPercentageScore =
            Math.round(state.currentQuiz.scorePercentage * 100) / 100;
        return roundedPercentageScore;
    }

    function checkIfHighscoreBeaten(score) {
        let highscore;
        switch (state.currentQuiz.quizNumber) {
            case 1:
                if (score > state.birdQuiz.highscores.quizOne) {
                    state.birdQuiz.highscores.quizOne = score;
                }
                highscore = state.birdQuiz.highscores.quizOne;
                break;
            case 2:
                if (score > state.birdQuiz.highscores.quizTwo) {
                    state.birdQuiz.highscores.quizTwo = score;
                }
                highscore = state.birdQuiz.highscores.quizTwo;
                break;
            case 3:
            case 4:
                if (score > state.birdQuiz.highscores.quizThree) {
                    state.birdQuiz.highscores.quizThree = score;
                }
                highscore = state.birdQuiz.highscores.quizThree;
                break;
        }
        window.localStorage.setItem(
            'localBirdQuizDatabase',
            JSON.stringify(state.birdQuiz),
        );
        return highscore;
    }

    function quitQuiz() {
        clearAllIntervals();
        removeBtnEventListeners();
        view.setToScreen('mainMenu');
        return null;
    }

    function clearAllIntervals() {
        clearIntervals('countdown');
        clearIntervals('pause');
    }

    function removeBtnEventListeners() {
        [...document.querySelectorAll('.answerBtn')].forEach(function(
            button,
            i,
        ) {
            button.removeEventListener('click', buttonSelected, false);
        });
        document
            .getElementById('banImageBtn')
            .removeEventListener('click', manualAddToBanList, false);
        document
            .getElementById('banReturnBtn')
            .removeEventListener('click', cancelBan, false);
        document
            .getElementById('confirmBanBtn')
            .removeEventListener('click', confirmBan, false);
        document
            .getElementById('cancelBanBtn')
            .removeEventListener('click', cancelBan, false);
    }

    initQuiz(quizNumber);
};

class IntervalObj {
    constructor(intervalID, type, active) {
        this.intervalID = intervalID;
        this.type = type;
        this.active = active;
    }
}

state.intervals = [];

function createInterval(funcToPass, typeOfInterval, tickTime) {
    const foundInt = state.intervals.some(
        el => el.active === true && el.type === typeOfInterval,
    );
    foundInt
        ? null
        : state.intervals.push(
              new IntervalObj(
                  setInterval(funcToPass, tickTime),
                  typeOfInterval,
                  true,
              ),
          );
}

function clearIntervals(typeOfInterval) {
    for (var i = 0; i < state.intervals.length; i++) {
        if (state.intervals[i].type == typeOfInterval) {
            clearInterval(state.intervals[i].intervalID);
            state.intervals[i].active = false;
        }
    }
}

function randomIntBetweenTwoValues(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
