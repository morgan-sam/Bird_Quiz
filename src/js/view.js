export const fourNameQuizUI = (birdPhotoURL, birdObj) => {
    document.getElementById("birdImage").src = birdPhotoURL;
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.innerHTML = birdObj[i][0];
    });
};