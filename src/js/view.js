export const setLoadingScreen = loadingScreenText => {
    document.getElementById('quizLoadingText').innerHTML = loadingScreenText;
    setToScreen('quizLoadingScreen');
};

export const fourNameNewQuestionUI = (
    birdPhotoURL,
    birdObjArr,
    score,
    questionNumber,
    numberOfQuestions,
) => {
    setQuestionText(`Which bird is this?`);
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
        updateQuestionNumber(questionNumber, numberOfQuestions);
        loadingGifOverlay(false);
        resetButtons();
        removeButtonImages();
        updateScore(score);
        setTimerState(false);
        return true;
    })());
    return imgLoaded;
};

export const fourImgNewQuestionUI = (
    birdPhotoArray,
    chosenBird,
    score,
    questionNumber,
    numberOfQuestions,
) => {
    addPhotosToButtons(birdPhotoArray);
    setQuestionText(`Which one is the ${chosenBird}?`);
    updateQuestionNumber(questionNumber, numberOfQuestions);
    updateScore(score);
    setTimerState(false);
    resetButtons();
};

export const setQuestionText = text => {
    document.getElementById('birdQuestion').innerHTML = text;
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

export const updateQuestionNumber = (questionNumber, numberOfQuestions) => {
    document.getElementById('questionNumber').innerHTML = questionNumber;
    document.getElementById('numberOfQuestions').innerHTML = numberOfQuestions;
};

export const setAnswerButtonsState = (buttonStates, quizNumber) => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        switch (buttonStates[i]) {
            case 'incorrect':
                button.className += ' incorrectButton';
                button.disabled = true;
                if ([2, 4].includes(quizNumber)) {
                    button.className += ' incorrectBorder';
                }
                break;
            case 'correct':
                button.className += ' correctButton';
                button.disabled = true;
                if ([2, 4].includes(quizNumber))
                    button.className += ' correctBorder';
                break;
            case 'unselected':
                break;
        }
    });
};

export const resetButtons = () => {
    removeAnswerButtonBorders();
    resetButtonColor();
    unblurAnswerButtons();
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

export const removeAnswerButtonBorders = () => {
    [...document.querySelectorAll('.answerBtn')].forEach(function(button, i) {
        button.classList.remove('correctBorder');
        button.classList.remove('incorrectBorder');
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

export const setTimerState = boo => {
    if (boo) document.getElementById('quizScreen').classList.add('timerActive');
    else document.getElementById('quizScreen').classList.remove('timerActive');
};

export const setCountdownState = (cycle, mod, mainColor, backgroundColor) => {
    const timer = document.getElementById('countdownTimer');
    timer.style.backgroundImage = `linear-gradient(
                ${cycle}deg,
                ${mod ? mainColor : backgroundColor} 50%,
                transparent 50%
            ),
            linear-gradient(${270}deg, ${mainColor} 50%, ${backgroundColor} 50%)`;
};
