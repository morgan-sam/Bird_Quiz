//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';
import '../css/main.css';

const state = {};

state.birdData = new Birds;

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

document.getElementById('resetDatabase').addEventListener("click", () => controlGetDatabase());


window.addEventListener('load', () => {
    state.currentQuiz = new Object;
    async function setUpQuiz() {

        console.log(state.birdData);
        try {
            state.birdData.birds = await JSON.parse(window.localStorage.getItem('localBirdList'));
            // await controlGetDatabase();
            await controlSetUpFourNameQuiz();

        } catch (error) {
            console.log(error);
        }
    }
    setUpQuiz();

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
//        console.log(birdPhoto);
        if (birdPhoto){
        state.currentQuiz.birdPhoto = birdPhoto;
        } else {
            return newQuestion();
        }
        state.currentQuiz.birdObj = birdObj;        
        await view.fourNameQuizUI(birdPhoto, birdObj, state.currentQuiz.score);
        view.resetButtonColor();
    }

    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.addEventListener("click", () => checkIfAnswerCorrect(i));
    });

    function checkIfAnswerCorrect(i) {
        if (state.currentQuiz.birdObj[i][1]) {
            console.log('You are correct!');
            document.getElementById(`answer-${i+1}`).className += " correctButton";
            state.currentQuiz.score++;
            newQuestion();
            console.log(state);
        } else {
            console.log('That was incorrect.')
            document.getElementById(`answer-${i+1}`).className += " incorrectButton";
            state.currentQuiz.score--;
        }
        view.updateScore(state.currentQuiz.score);
    };

    newQuestion(state.currentQuiz.score);
};


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};