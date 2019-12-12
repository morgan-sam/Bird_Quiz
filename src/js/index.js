//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';
import '../css/main.css';

import transparentLoadingGif from '../img/transparentLoading.gif';
import birdsFlying from '../img/bird_flying.png';

const state = {};

document.getElementById('resetDatabase').addEventListener('click', () => {
    if (
        confirm(
            'Are you sure you want to reset the database? This will delete the entire ban list as well as all highscores.',
        )
    ) {
        controlGetDatabase();
    }
});
document
    .getElementById('fourAnsOneImgBtn')
    .addEventListener('click', () => startQuiz(1));
document
    .getElementById('oneAnsFourImgBtn')
    .addEventListener('click', () => startQuiz(2));

[...document.querySelectorAll('.navBtn')].forEach(function(button) {
    button.addEventListener('click', () => view.setToScreen(button.value));
});

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
    state.currentQuiz = new Object();

    function quizButtonInit() {
        [...document.querySelectorAll('.answerBtn')].forEach(function(
            button,
            i,
        ) {
            button.addEventListener('click', buttonSelected, false);
        });
        [...document.querySelectorAll('.quitBtn')].forEach(function(button) {
            button.addEventListener(
                'click',
                function _listener() {
                    quitQuiz();
                    button.removeEventListener('click', _listener, true);
                },
                true,
            );
        });
        document
            .getElementById('banImageBtn')
            .addEventListener('click', manualAddToBanList, false);
        document
            .getElementById('banReturnBtn')
            .addEventListener('click', cancelBan, false);
        document
            .getElementById('confirmBanBtn')
            .addEventListener('click', confirmBan, false);
        document
            .getElementById('cancelBanBtn')
            .addEventListener('click', cancelBan, false);
    }

    function initQuiz(quizNumber) {
        quizButtonInit();
        state.currentQuiz.score = 0;
        state.currentQuiz.quizNumber = quizNumber;
        state.currentQuiz.questionNumber = 1;
        state.currentQuiz.answerButtonFunction = quizAnswerClicked;
        view.setLoadingScreen('Loading Quiz...');
        switch (quizNumber) {
            case 1:
                state.currentQuiz.quizFunction = fourAnswerQuizQuestion;
                break;
            case 2:
                state.currentQuiz.quizFunction = fourImageQuizQuestion;
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
            );
            await view.setToScreen('quizScreen');
        } catch {
            return state.birdQuiz.pingWikipedia(
                fourImageQuizQuestion,
                quitQuiz,
            );
        }
    };

    function manualAddToBanList() {
        switch (state.currentQuiz.quizNumber) {
            case 1:
                banImgSelected(0);
                break;
            case 2:
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
        let chosenBird = randomIntFromInterval(0, 3);
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
        view.enableAnswerButtons(false);
        state.currentQuiz.score += 2;
        state.currentQuiz.questionNumber++;
        checkIfQuizComplete();
    }

    function incorrectAnswer() {
        const wrongAnswers = state.currentQuiz.birdObjArr.filter(
            el => el.clicked === true,
        ).length;
        //-1 for 1st wrong answer, -2 for 2nd, -3 for 3rd
        state.currentQuiz.score -= wrongAnswers;
    }

    function checkIfQuizComplete() {
        if (state.currentQuiz.questionNumber > 10) {
            return setTimeout(function() {
                return quizComplete();
            }, 1000);
        } else {
            state.currentQuiz.quizFunction();
        }
    }

    function quizComplete() {
        const [
            roundedPercentage,
            roundedHighscore,
        ] = calculateAndStoreHighscores();
        view.updateGameCompleteScreen(
            state.currentQuiz.score,
            roundedPercentage,
            roundedHighscore,
        );
        view.setToScreen('quizCompleteScreen');
    }

    function calculateAndStoreHighscores() {
        state.currentQuiz.scorePercentage =
            (100 * (state.currentQuiz.score + 40)) / 60;
        if (state.currentQuiz.scorePercentage > state.highscores.quizOne) {
            state.highscores.quizOne = state.currentQuiz.scorePercentage;
            window.localStorage.setItem(
                'highscores',
                JSON.stringify(state.highscores),
            );
        }
        let roundedPercentage =
            Math.round(state.currentQuiz.scorePercentage * 100) / 100;
        let roundedHighscore = Math.round(state.highscores.quizOne * 100) / 100;
        return [roundedPercentage, roundedHighscore];
    }

    function quitQuiz() {
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
        view.setToScreen('mainMenu');
        return null;
    }

    initQuiz(quizNumber);
};

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
