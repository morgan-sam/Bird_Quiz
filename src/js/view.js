export const fourNameQuizUI = () => {
    document.getElementById("fourAnswerOneImgQuiz").classList.add('active');
};

export const fourNameNewQuestionUI = (birdPhotoURL, birdObj, score) => {

    let img = document.getElementById("birdImage");

    document.getElementById("birdImage").src = birdPhotoURL;
    document.getElementById("birdImage").height = '400';
    let imgLoaded = document.getElementById("birdImage").onload = function() {
        resetButtonColor();
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.innerHTML = birdObj[i][0];
        });
        loadingGifOverlay(false);
        enableAnswerButtons(true);
        updateScore(score);
        return true;
    }();
    return imgLoaded;
};

export const updateScore = (score) => {
    document.getElementById("score").innerHTML = score;
};

export const clearButtons = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.innerHTML = '';
    });
};

export const resetButtonColor = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.classList.remove('correctButton');
        button.classList.remove('incorrectButton');
    });
};

export const enableAnswerButtons = (booState) => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.disabled = !booState;
    });
};

export const loadingGifOverlay = (booState) => {
    let overlay = document.getElementById("loadingOverlay");
    booState ? overlay.style.display = 'block' : overlay.style.display = 'none';
};

export const makeOneMenuVisible = (selection) => {
    document.querySelectorAll('.menu').forEach(function(menu) {
        menu.classList.remove('active');
    });
    if (selection) document.getElementById(selection).classList.add('active');
};

export const clearQuizUI = () => {
    document.querySelectorAll('.quiz').forEach(function(quiz) {
        quiz.classList.remove('active');
    });
    makeOneMenuVisible('mainMenu');
};

export const quizLoadingScreen = (booState) => {
    let text = document.getElementById("quizLoadingScreen");
    booState ? text.style.display = 'block' : text.style.display = 'none';
};