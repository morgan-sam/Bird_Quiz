export const addImageToDocument = (birdPhotoURL, birdObj) => {
    var img = document.getElementById("birdImage");
    img.src = birdPhotoURL;
    // document.body.appendChild(img);
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.innerHTML = birdObj[i][0];
        button.addEventListener("click", function() {
            checkIfAnswerCorrect(i)
        });
    });

    function checkIfAnswerCorrect(i) {
        if (birdObj[i][1]) {
            alert('You are correct!')
        } else {
            alert('That was incorrect.')
        }
    };
};