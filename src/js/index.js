//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';

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
    console.log("Completed 1st");
};


window.addEventListener('load', () => {

    async function setUpQuiz() {
        try {
            await controlGetDatabase();
            await controlSetUpFourNameQuiz();
            await view.addImageToDocument(state.birdData.img);
        } catch (error) {
            console.log(error);
        }
    }
    let promise = setUpQuiz();


});

const controlSetUpFourNameQuiz = async () => {

    let birdArray = [...Array(4).keys()].map(el => state.birdData.birds[Math.floor(Math.random() * state.birdData.birds.length)]);

    let currentBird = birdArray[randomIntFromInterval(0, 3)];

    try {
        await state.birdData.getBirdPhoto(currentBird);
    } catch (err) {
        console.log(err);
        alert('Something wrong with the search...');
    }
    console.log("Completed 2nd");

};


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};