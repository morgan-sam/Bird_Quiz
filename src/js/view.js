export const fourNameQuizUI = (birdPhotoURL, birdObj, score) => {
    document.getElementById("birdImage").src = birdPhotoURL;
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.innerHTML = birdObj[i][0];
    });
    updateScore(score);
};

export const updateScore = (score) => {
    document.getElementById("score").innerHTML = score;
}