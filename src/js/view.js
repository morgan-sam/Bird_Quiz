export const fourNameNewQuestionUI = (birdPhotoURL, birdObjArr, score, questionNumber) => {

    let img = document.getElementById("birdImage");

    document.getElementById("birdImage").src = birdPhotoURL;
    document.getElementById("birdImage").height = '400';
    let imgLoaded = document.getElementById("birdImage").onload = function() {
        resetButtonColor();
        [...document.querySelectorAll('.answerBtnText')].forEach(function(span, i) {
            span.innerHTML = birdObjArr[i].bird;
        });
        document.getElementById("questionNumber").innerHTML = questionNumber;
        loadingGifOverlay(false);
        enableAnswerButtons(true);
        updateScore(score);
        return true;
    }();
    return imgLoaded;
};

export const fourImgNewQuestionUI = (birdPhotoArray, chosenBird, score, questionNumber) => {

    for (let i = 0; i < 4; i++) {
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.style.backgroundImage = `url(${birdPhotoArray[i]})`;
        });
        [...document.querySelectorAll('.answerBtnBg')].forEach(function(buttonBg, i) {
            buttonBg.style.backgroundImage = `url(${birdPhotoArray[i]})`;
            buttonBg.style.filter = 'blur(3px)';
            buttonBg.style.zIndex = '-1';
        });
    };
    document.getElementById("birdQuestion").innerHTML = `Which one is the ${chosenBird}?`;
    document.getElementById("questionNumber").innerHTML = questionNumber;
    enableAnswerButtons(true);
    updateScore(score);
};

export const updateScore = (score) => {
    document.getElementById("score").innerHTML = score;
};

export const clearButtons = () => {
    [...document.querySelectorAll('.answerBtnText')].forEach(function(buttonText, i) {
        buttonText.innerHTML = '';
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

export const unblurAnswerButtons = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.style.opacity = 1;
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
    document.getElementById('quizScreen').classList.add('quizTwo');
    updateScore(score);
};