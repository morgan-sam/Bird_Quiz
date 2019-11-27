export const fourNameQuizUI = (birdPhotoURL, birdObj, score) => {


    updateScore(score);
    document.getElementById("birdImage").src = birdPhotoURL;
    document.getElementById("birdImage").onload = function() {
        resetButtonColor();
        [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
            button.innerHTML = birdObj[i][0];
        });
        enableAnswerButtons(true);
    }
};

export const updateScore = (score) => {
    document.getElementById("score").innerHTML = score;
}

export const clearButtons = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.innerHTML = '';
    });
}

export const resetButtonColor = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.classList.remove('correctButton');
        button.classList.remove('incorrectButton');
    });
}

export const enableAnswerButtons = (booState) => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.disabled = !booState;
    });
}