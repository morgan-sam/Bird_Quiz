//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';
import '../css/main.css';

const state = {};

const controlGetDatabase = async () => {

    state.birdData = new Birds;

    try {
        await state.birdData.getBirdList();

    } catch (err) {
        console.log(err);
        alert('Something wrong with the search...');
    }

    state.birdData.parseBirdList();
};


window.addEventListener('load', () => {
    state.currentQuiz = new Object;

    async function setUpQuiz() {
        try {
            await controlGetDatabase();
            await controlSetUpFourNameQuiz();

        } catch (error) {
            console.log(error);
        }
    }
    let promise = setUpQuiz();

});



const controlSetUpFourNameQuiz = async () => {

    state.currentQuiz.score = 0;

    async function newQuestion() {

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
            newQuestion();
            alert('Something wrong with the search...');
        }
        view.fourNameQuizUI(birdPhoto, birdObj, state.currentQuiz.score);

        state.currentQuiz.birdObj = birdObj;
        state.currentQuiz.birdPhoto = birdPhoto;
    }

    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.addEventListener("click", () => checkIfAnswerCorrect(i));
    });

    function checkIfAnswerCorrect(i) {
        if (state.currentQuiz.birdObj[i][1]) {
            alert('You are correct!');
            state.currentQuiz.score++;
            newQuestion();
            console.log(state);
        } else {
            alert('That was incorrect.')
            state.currentQuiz.score--;
        }
        view.updateScore(state.currentQuiz.score);
    };

    newQuestion(state.currentQuiz.score);
};


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};