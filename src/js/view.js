export const fourNameQuizUI = (birdPhotoURL, birdObj, score) => {

    let img = document.getElementById("birdImage");

    document.getElementById("birdImage").src = birdPhotoURL;
    document.getElementById("birdImage").height = '400';
    document.getElementById("birdImage").onload = function() {
        resetButtonColor();
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.innerHTML = birdObj[i][0];
            loadingGifOverlay(false);
        });
        enableAnswerButtons(true);
    }
    updateScore(score);
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