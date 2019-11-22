//CONTROLLER

import Birds from './model.js';
import * as view from './view.js';

const state = {};

const controlGetDatabase = async () => {


    state.birdData = new Birds;

    try {
        // 4) Search for recipes
        await state.birdData.getBirdList();

    } catch (err) {
        console.log(err);
        alert('Something wrong with the search...');
    }

    state.birdData.parseBirdList();
    console.log(state.birdData.birds);
    state.birdData.getBirdPhoto(state.birdData.birds[Math.floor(Math.random() * state.birdData.birds.length)]);

};


window.addEventListener('load', () => {
    controlGetDatabase();
    // controlSetUpFourNameQuiz();

});

const controlSetUpFourNameQuiz = async () => {

    let birdArray = [...Array(4).keys()].map(el => state.birdData.birds[Math.floor(Math.random() * state.birdData.birds.length)]);
    console.log(birdArray);

    // Loop get 4 birds in an array
    let currentBird = state.birdData.birds[Math.floor(Math.random() * state.birdData.birds.length)];

    //Get photo and id of one to be the correct bird
    let birdPhotoLink = state.birdData.getBirdPhoto(currentBird);

};