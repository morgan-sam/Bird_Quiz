export const fourNameNewQuestionUI = (
    birdPhotoURL,
    birdObjArr,
    score,
    questionNumber,
) => {
    let img = document.getElementById('birdImage');
    document.getElementById('birdImage').src = birdPhotoURL;
    document.getElementById('birdImage').height = '400';
    let imgLoaded = (document.getElementById('birdImage').onload = (function() {
        [...document.querySelectorAll('.answerBtnText')].forEach(function(
            span,
            i,
        ) {
            span.innerHTML = birdObjArr[i].bird;
        });
        updateQuestionNumber(questionNumber);
        loadingGifOverlay(false);
        resetButtons();
        removeButtonImages();
        updateScore(score);
        return true;
    })());
    return imgLoaded;
};

export const fourImgNewQuestionUI = (
    birdPhotoArray,
    chosenBird,
    score,
    questionNumber,
) => {
    addPhotosToButtons(birdPhotoArray);
    document.getElementById(
        'birdQuestion',
    ).innerHTML = `Which one is the ${chosenBird}?`;
    updateQuestionNumber(questionNumber);
    updateScore(score);
    resetButtons();
};

export const addPhotosToButtons = buttonPhotos => {
    for (let i = 0; i < buttonPhotos.length; i++) {
        [...document.querySelectorAll('.answerBtn')].forEach(function(
            button,
            i,
        ) {
            button.style.backgroundImage = `url(${buttonPhotos[i]})`;
        });
        [...document.querySelectorAll('.answerBtnBg')].forEach(function(
            buttonBg,
            i,
        ) {
            buttonBg.style.backgroundImage = `url(${buttonPhotos[i]})`;
            buttonBg.style.filter = 'blur(3px)';
            buttonBg.style.zIndex = '-1';
        });
    }
};

export const updateScore = score => {
    document.getElementById('score').innerHTML = score;
};

export const updateQuestionNumber = questionNumber => {
    document.getElementById('questionNumber').innerHTML = questionNumber;
};

//Have setAnswerButtonsState() Fn where array of every button is passed rather than individual buttons

export const setAnswerButtonsState = (buttonStates, quizNumber) => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        switch (buttonStates[i]) {
            case 'incorrect':
                button.className += ' incorrectButton';
                button.disabled = true;
                if (quizNumber === 2) button.style.opacity = 0.5;
                if (quizNumber === 2) button.style.border = '5px solid red';
                break;
            case 'correct':
                button.className += ' correctButton';
                button.disabled = true;
                if (quizNumber === 2) button.style.border = '5px solid green';
                break;
            case 'unselected':
                break;
        }
    });
};

export const resetButtons = () => {
    resetButtonColor();
    unblurAnswerButtons();
    removeAnswerButtonBorders();
    resetButtonColor();
    enableAnswerButtons(true);
};

export const clearButtons = () => {
    [...document.querySelectorAll('.answerBtnText')].forEach(function(
        buttonText,
        i,
    ) {
        buttonText.innerHTML = '';
    });
};

export const resetButtonColor = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.classList.remove('correctButton');
        button.classList.remove('incorrectButton');
    });
};

export const removeButtonImages = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.style.backgroundImage = 'none';
    });
    [...document.querySelectorAll('.answerBtnBg')].forEach(function(
        buttonBg,
        i,
    ) {
        buttonBg.style.backgroundImage = 'none';
    });
};

export const enableAnswerButtons = booState => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.disabled = !booState;
    });
};

export const unblurAnswerButtons = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.style.opacity = 1;
    });
};

export const removeAnswerButtonBorders = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.style.border = 'none';
    });
};

export const loadingGifOverlay = booState => {
    let overlay = document.getElementById('loadingOverlay');
    booState
        ? (overlay.style.display = 'block')
        : (overlay.style.display = 'none');
};

export const setToScreen = screen => {
    document.querySelectorAll('.quiz').forEach(function(quiz) {
        quiz.classList.remove('active');
    });
    document.querySelectorAll('.menu').forEach(function(menu) {
        menu.classList.remove('active');
    });
    setBanSelectionScreen(false);
    if (screen) document.getElementById(screen).classList.add('active');
};

export const updateGameCompleteScreen = (score, percentage, personalBest) => {
    document.getElementById('scoreValue').innerHTML = score;
    document.getElementById('scorePercentage').innerHTML = percentage;
    document.getElementById('personalBest').innerHTML = personalBest;
};

export const setQuizScreen = quizClass => {
    loadingGifOverlay(true);
    const quizScreen = document.getElementById('quizScreen');
    //removes all quizOne quizTwo etc classes but leaves quiz and active alone
    quizScreen.className = quizScreen.className.replace(/(quiz[a-zA-Z]+)/g, '');
    quizScreen.classList.add(quizClass);
};

export const setBanImage = banImage => {
    document.getElementById('banImage').src = banImage;
    document.getElementById('banImage').height = '500';
};

export const setBanSelectionScreen = boo => {
    if (boo)
        document.getElementById('quizScreen').classList.add('banSelection');
    else document.getElementById('quizScreen').classList.remove('banSelection');
};
