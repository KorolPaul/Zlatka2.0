window.onload = function () {

    info = document.getElementById('info');
    infoClose = document.getElementById('info_close');
    training = document.getElementById('training');
    trainingsBlock = document.getElementById('trainings');
    trainingsPopup = document.getElementById('trainings-popup');
    droppable = document.getElementsByClassName('droppable');
    muscules = document.querySelectorAll('path, .muscles_title');
    musculesSides = document.querySelectorAll('.muscles_side');
    excercise = document.getElementById('excercise');
    excercises = document.getElementById('excercises');
    excerciseSetsHolder = document.getElementById('excercise_sets-holder');
    avatar = document.getElementById('avatar');
    menuTrigger = document.getElementById('menu-trigger');
    sheduleElement = document.getElementById('shedule');
    menuPopup = document.querySelector('.menu_popup');
        
    Training.loadProgram();

    infoClose.onclick = function (e) {
        e.preventDefault();
        info.classList.remove('opened');
        Routing.setPage('main', '/');
    }

    for (var i = 0; i < muscules.length; i++) {
        utils.addEvent(muscules[i], ['click', 'touchend'], UI.showExcercises);
    }

    for (var i = 0; i < droppable.length; i++) {
        trainings.push(droppable[i]);
    }

    var sets = trainingsBlock.querySelectorAll('.sets');
    for (var i = 0; i < sets.length; i++) {
        sets[i].addEventListener('input', kach.validateSets, false);
    }

    document.onkeydown = UI.clearLocalStorage; //remove after release

    new Body();

    closeExcercise.addEventListener('click', Excercise.close);
    deleteExcercise.addEventListener('click', Excercise.delete);
    copyExcercise.addEventListener('click', Excercise.showCopyPopup);
    document.getElementById('close-copy-popup').addEventListener('click', Excercise.hideCopyPopup);
    
    menuTrigger.addEventListener('click', UI.toggleMenu);

    addTrainingButtons.forEach(function (el) {
        el.addEventListener('click', Training.add);
    });

    document.querySelector('#shedule-toggle').onclick = function (e) {
        e.preventDefault();
        Training.showPopup();
        UI.toggleMenu(e);
    };

    document.querySelector('#excercises-toggle').onclick = function (e) {
        e.preventDefault();
        Training.hidePopup();
        Search.hidePopup();
        UI.toggleMenu(e);
    };

    UI.loadExcercises();
    UI.loadAvatar();

    gapi.load('client', UI.loadAvatar);
}

