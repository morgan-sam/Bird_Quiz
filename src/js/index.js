//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';
import '../css/main.css';

import transparentLoadingGif from '../img/transparentLoading.gif';

const state = {};

state.birdData = new Birds;


document.getElementById('resetDatabase').addEventListener("click", () => controlGetDatabase());
document.getElementById('fourAnsOneImgBtn').addEventListener("click", () => controlSetUpFourNameQuiz());

[...document.querySelectorAll('.navBtn')].forEach(function(button) {
    button.addEventListener("click", () => view.setToScreen(button.value));
});

const controlGetDatabase = async () => {

    try {
        await state.birdData.getBirdList();

    } catch (err) {
        console.log(err);
        alert('Something wrong with the search...');
    }

    state.birdData.parseBirdList();
    window.localStorage.setItem('localBirdList', JSON.stringify(state.birdData.birds));
    console.log(state.birdData);
};



window.addEventListener('load', () => {
    state.currentQuiz = new Object;
    async function loadLocalDatabase() {

        console.log(state.birdData);
        try {
            state.birdData.birds = await JSON.parse(window.localStorage.getItem('localBirdList'));

        } catch (error) {
            console.log(error);
        }
    }
    loadLocalDatabase();

});



const controlSetUpFourNameQuiz = async () => {

    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.addEventListener("click", checkButtonCorrect, false);
    });
    [...document.querySelectorAll('.quitBtn')].forEach(function(button) {
        button.addEventListener("click", function _listener() {
            quitQuiz();
            button.removeEventListener("click", _listener, true);
        }, true);
    });
    /*
        document.getElementById('quitQuiz').addEventListener("click", function _listener() {
            quitQuiz();
            document.getElementById('quitQuiz').removeEventListener("click", _listener, true);
        }, true);
    */
    state.currentQuiz.score = 0;
    state.currentQuiz.questionNumber = 1;
    view.setToScreen('quizLoadingScreen');

    newQuestion(state.currentQuiz.score);

    async function newQuestion() {

        view.loadingGifOverlay(true);

        let birdArray = [...Array(4).keys()].map(el => state.birdData.birds[Math.floor(Math.random() * state.birdData.birds.length)]);
        let chosenBird = randomIntFromInterval(0, 3);

        let birdObj = Object.assign({}, birdArray);
        Object.keys(birdObj).map(function(key, index) {
            birdObj[key] = [birdObj[key], index === chosenBird ? true : false];
        });


        let currentBird = birdArray[chosenBird];
        let birdPhoto;
        try {
            birdPhoto = await state.birdData.getBirdPhoto(currentBird);
        } catch (err) {
            console.log(err);
        }

        if (birdPhoto) {
            state.currentQuiz.birdPhoto = birdPhoto;
        } else {
            //If program could not get photo check if connection to Wikipedia available
            let connection = await state.birdData.pingWikipedia();
            if (connection) {
                //If so reset question
                return newQuestion();
            } else {
                //If not stop program
                alert('Could not connect to Wikipedia');
                return quitQuiz();
            }
        }

        state.currentQuiz.birdObj = birdObj;


        //Checks if Image Loaded on first question to load UI so no blank buttons/image appear
        if (state.currentQuiz.questionNumber === 1) {
            let questionReady;
            questionReady = await view.fourNameNewQuestionUI(birdPhoto, birdObj, state.currentQuiz.score, state.currentQuiz.questionNumber);
            if (questionReady) {
                await view.setToScreen('fourAnswerOneImgQuiz');
            }
        } else {
            //Buttons/image already loaded so no need to load UI
            await view.fourNameNewQuestionUI(birdPhoto, birdObj, state.currentQuiz.score, state.currentQuiz.questionNumber);
        }
    }

    function checkButtonCorrect(evt) {
        let i = (evt.target.id.replace('answer-', '')) - 1;
        document.getElementById(`answer-${i+1}`).disabled = true;
        if (state.currentQuiz.birdObj[i][1]) {
            document.getElementById(`answer-${i+1}`).className += " correctButton";
            view.enableAnswerButtons(false);
            state.currentQuiz.score += 2;
            state.currentQuiz.questionNumber++;
            if (state.currentQuiz.questionNumber > 10) {
                console.log('game over!');
                console.log(`Your score is ${state.currentQuiz.score}`);
                console.log('return to main menu');
                return quizComplete();
            } else {
                newQuestion();
            }
        } else {
            document.getElementById(`answer-${i+1}`).className += " incorrectButton";
            state.currentQuiz.score--;
        }
        view.updateScore(state.currentQuiz.score);

    };

    function quizComplete() {
        view.setToScreen('quizCompleteScreen');
    }

    function quitQuiz() {
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.removeEventListener("click", checkButtonCorrect, false);
        });
        view.setToScreen('mainMenu');
        return null;
    }

};

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};