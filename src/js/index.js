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

    async function setUpQuiz() {
        try {
            await controlGetDatabase();
            let birdObj = await controlSetUpFourNameQuiz();
            console.log(birdObj);
            await view.addImageToDocument(state.birdData.img, birdObj);

        } catch (error) {
            console.log(error);
        }
    }
    let promise = setUpQuiz();


});

const controlSetUpFourNameQuiz = async () => {

    let birdArray = [...Array(4).keys()].map(el => state.birdData.birds[Math.floor(Math.random() * state.birdData.birds.length)]);
    let chosenBird = randomIntFromInterval(0, 3);

    let birdObj = Object.assign({}, birdArray);
    Object.keys(birdObj).map(function(key, index) {
        birdObj[key] = [birdObj[key], index === chosenBird ? true : false];
    });

    let currentBird = birdArray[chosenBird];

    try {
        await state.birdData.getBirdPhoto(currentBird);
    } catch (err) {
        console.log(err);
        alert('Something wrong with the search...');
    }

    return birdObj;
};


function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};