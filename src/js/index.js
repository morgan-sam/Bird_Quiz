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
    button.addEventListener("click", () => view.makeOneMenuVisible(button.value));
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

    state.currentQuiz.score = 0;
    state.currentQuiz.buttons = [];

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
        await view.fourNameQuizUI(birdPhoto, birdObj, state.currentQuiz.score);
    }

    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.addEventListener("click", checkButtonCorrect, false);
    });

    document.getElementById('quitQuiz').addEventListener("click", function _listener() {
        quitQuiz();
        document.getElementById('quitQuiz').removeEventListener("click", _listener, true);
    }, true);

    function checkButtonCorrect(evt) {
        let i = (evt.target.id.replace('answer-', '')) - 1;
        document.getElementById(`answer-${i+1}`).disabled = true;
        if (state.currentQuiz.birdObj[i][1]) {
            document.getElementById(`answer-${i+1}`).className += " correctButton";
            view.enableAnswerButtons(false);
            state.currentQuiz.score++;
            newQuestion();
        } else {
            document.getElementById(`answer-${i+1}`).className += " incorrectButton";
            state.currentQuiz.score--;
        }
        view.updateScore(state.currentQuiz.score);
    };

    function quitQuiz() {
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.removeEventListener("click", checkButtonCorrect, false);
        });
        view.clearQuizUI();
        return null;
    }

    newQuestion(state.currentQuiz.score);
};

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};