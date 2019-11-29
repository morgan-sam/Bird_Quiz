export const fourNameNewQuestionUI = (birdPhotoURL, birdObj, score, questionNumber) => {

    let img = document.getElementById("birdImage");

    document.getElementById("birdImage").src = birdPhotoURL;
    document.getElementById("birdImage").height = '400';
    let imgLoaded = document.getElementById("birdImage").onload = function() {
        resetButtonColor();
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.innerHTML = birdObj[i][0];
        });
        document.getElementById("questionNumber").innerHTML = questionNumber;
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

export const setToScreen = (screen) => {
    document.querySelectorAll('.quiz').forEach(function(quiz) {
        quiz.classList.remove('active');
    });
    document.querySelectorAll('.menu').forEach(function(menu) {
        menu.classList.remove('active');
    });
    if (screen) document.getElementById(screen).classList.add('active');
};

export const updateGameCompleteScreen = (score, percentage, personalBest) => {
    document.getElementById("scoreValue").innerHTML = score;
    document.getElementById("scorePercentage").innerHTML = percentage;
    document.getElementById("personalBest").innerHTML = personalBest;
};

export const setToQuizTwo = () => {
    document.getElementById('fourAnswerOneImgQuiz').classList.add('quizTwo');
};