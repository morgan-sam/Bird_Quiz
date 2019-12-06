//CONTROLLER

import Birds from "./model.js";
import * as view from "./view.js";
import "../css/main.css";

import transparentLoadingGif from "../img/transparentLoading.gif";
import birdsFlying from "../img/bird_flying.png";

const state = {};

state.birdData = new Birds();

document
  .getElementById("resetDatabase")
  .addEventListener("click", () => controlGetDatabase());
document
  .getElementById("fourAnsOneImgBtn")
  .addEventListener("click", () => startQuiz(1));
document
  .getElementById("oneAnsFourImgBtn")
  .addEventListener("click", () => startQuiz(2));

[...document.querySelectorAll(".navBtn")].forEach(function(button) {
  button.addEventListener("click", () => view.setToScreen(button.value));
});

const controlGetDatabase = async () => {
  try {
    await state.birdData.getBirdList();
  } catch (err) {
    console.log(err);
    alert("Something wrong with the search...");
  }

  state.birdData.parseBirdList();
  window.localStorage.setItem(
    "localBirdList",
    JSON.stringify(state.birdData.birds)
  );
  state.highscores = {
    quizOne: 0,
    quizTwo: 0,
    quizThree: 0
  };
  console.log(state.birdData);
};

window.addEventListener("load", () => {
  state.currentQuiz = new Object();
  async function loadLocalDatabase() {
    console.log(state.birdData);
    try {
      state.birdData.birds = await JSON.parse(
        window.localStorage.getItem("localBirdList")
      );
      state.highscores = await JSON.parse(
        window.localStorage.getItem("highscores")
      );
    } catch (error) {
      console.log(error);
    }
  }
  loadLocalDatabase();
});

const startQuiz = async quizNumber => {
  [...document.querySelectorAll(".answerBtn")].forEach(function(button, i) {
    button.addEventListener("click", checkButtonCorrect, false);
  });
  [...document.querySelectorAll(".quitBtn")].forEach(function(button) {
    button.addEventListener(
      "click",
      function _listener() {
        quitQuiz();
        button.removeEventListener("click", _listener, true);
      },
      true
    );
  });

  state.currentQuiz.score = 0;
  state.currentQuiz.questionNumber = 1;
  // view.setToScreen("quizLoadingScreen");
  quizComplete();

  const fourAnswerQuizQuestion = async () => {
    view.setQuizScreen("quizOne");
    view.loadingGifOverlay(true);
    let birdsObjArr = getFourBirdArr();
    let chosenBird = birdsObjArr.find(el => el.chosen === true).bird;
    const birdPhoto = await state.birdData.getBirdPhoto(chosenBird);
    if (!birdPhoto) return testConnection(fourAnswerQuizQuestion);
    if (birdPhoto)
      await view.fourNameNewQuestionUI(
        birdPhoto,
        birdsObjArr,
        state.currentQuiz.score,
        state.currentQuiz.questionNumber
      );
    if (state.currentQuiz.questionNumber === 1)
      await view.setToScreen("quizScreen");
  };

  const fourImageQuizQuestion = async () => {
    view.setQuizScreen("quizTwo");
    let birdsObjArr = getFourBirdArr();
    let chosenBird = birdsObjArr.find(el => el.chosen === true).bird;
    const birdPhotoArray = await getBirdPhotos(
      birdsObjArr,
      fourImageQuizQuestion
    );
    if (birdPhotoArray)
      await view.fourImgNewQuestionUI(
        birdPhotoArray,
        chosenBird,
        state.currentQuiz.score,
        state.currentQuiz.questionNumber
      );
    if (state.currentQuiz.questionNumber === 1)
      await view.setToScreen("quizScreen");
  };

  // if (quizNumber === 1) state.currentQuiz.quizFunction = fourAnswerQuizQuestion;
  // if (quizNumber === 2) state.currentQuiz.quizFunction = fourImageQuizQuestion;
  // console.log(state.currentQuiz.quizFunction.name);
  // state.currentQuiz.quizFunction();

  function getFourBirdArr() {
    let birdArray = [...Array(4).keys()].map(
      el =>
        state.birdData.birds[
          Math.floor(Math.random() * state.birdData.birds.length)
        ]
    );
    let chosenBird = randomIntFromInterval(0, 3);
    let birdObjArr = [];

    birdArray.forEach(function(el, i) {
      birdObjArr[i] = {
        bird: el,
        chosen: i === chosenBird ? true : false
      };
    });
    state.currentQuiz.birdObjArr = birdObjArr;
    return birdObjArr;
  }

  async function getBirdPhotos(birds, successFn) {
    const birdPhotoRequests = await birds.map(
      async el => await state.birdData.getBirdPhoto(el.bird)
    );
    const birdPhotoArray = await Promise.all(birdPhotoRequests);
    if (birdPhotoArray.includes(false)) return testConnection(successFn);
    return birdPhotoArray;
  }

  async function testConnection(successFn, failureFn = quitQuiz) {
    //If program could not get photo check if connection to Wikipedia available
    let connection = await state.birdData.pingWikipedia();
    if (connection) {
      //If so reset question
      return successFn();
    } else {
      //If not stop program
      alert("Could not connect to Wikipedia");
      return failureFn();
    }
  }

  function checkButtonCorrect(evt) {
    const selectedButton = document
      .getElementById(evt.target.id)
      .closest("button");
    selectedButton.disabled = true;
    const i = selectedButton.id.replace("answer-", "") - 1;
    if (state.currentQuiz.birdObjArr[i].chosen) {
      correctAnswer(selectedButton);
    } else {
      incorrectAnswer(selectedButton);
    }
    view.updateScore(state.currentQuiz.score);
  }

  function correctAnswer(button) {
    view.enableAnswerButtons(false);
    view.setButtonToCorrect(button, quizNumber);
    state.currentQuiz.score += 2;
    state.currentQuiz.questionNumber++;
    checkIfQuizComplete();
  }

  function incorrectAnswer(button) {
    //-1 for 1st wrong answer, -2 for 2nd, -3 for 3rd
    view.setButtonToWrong(button, quizNumber);
    state.currentQuiz.score -= parseInt(
      document.querySelectorAll(".incorrectButton").length
    );
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
    state.currentQuiz.scorePercentage =
      (100 * (state.currentQuiz.score + 40)) / 60;
    if (state.currentQuiz.scorePercentage > state.highscores.quizOne) {
      state.highscores.quizOne = state.currentQuiz.scorePercentage;
      window.localStorage.setItem(
        "highscores",
        JSON.stringify(state.highscores)
      );
    }
    let roundedPercentage =
      Math.round(state.currentQuiz.scorePercentage * 100) / 100;
    let roundedHighscore = Math.round(state.highscores.quizOne * 100) / 100;
    view.updateGameCompleteScreen(
      state.currentQuiz.score,
      roundedPercentage,
      roundedHighscore
    );
    view.setToScreen("quizCompleteScreen");
  }

  function quitQuiz() {
    [...document.querySelectorAll(".answerBtn")].forEach(function(button, i) {
      button.removeEventListener("click", checkButtonCorrect, false);
    });
    view.setToScreen("mainMenu");
    return null;
  }
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
