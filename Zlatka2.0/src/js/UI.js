
let trainings = [],
    xml = document.createElement('div'),
    isTouchDevice = 'ontouchstart' in document.documentElement;


let info,
    infoClose,
    training,
    trainingsBlock,
    trainingsPopup,
    droppable,
    muscules,
    musculesSides,
    musculesList,
    musculeTitles,
    excercise,
    excercises,
    excerciseSetsHolder,
    avatar,
    menuTrigger,
    menuPopup,
    sheduleElement;

const deleteExcercise = document.getElementById('delete-excercise'),
      copyExcercise = document.getElementById('copy-excercise'),
      deleteTraining = document.getElementById('delete-training'),
      copyTraining = document.getElementById('copy-training'),
      closeExcercise = document.getElementById('close-excercise'),
      copyPopup = document.getElementById('copy-popup'),
      editPopup = document.getElementById('edit-popup'),
      addTrainingButtons = document.querySelectorAll('.addTraining');


const UI = {

    toggleMenu: function (e) {
        e.preventDefault();

        menuTrigger.classList.toggle('menu_trigger__opened');
        menuPopup.classList.toggle('menu_popup__opened');
    },

    showInfo: function (e, excercise) {
        let excerciseUrl = utils.isSet(excercise) ? excercise : this.dataset.excersice,
            excerciseNode = xml.querySelector('#' + excerciseUrl),
            html = excerciseNode.querySelector('.info').innerHTML;
        
        Routing.setPage('info', '/excercise/' + excerciseNode.id, {
            title: excerciseNode.querySelector('.excercise-name').innerHTML,
            descr: excerciseNode.querySelector('.meta-description').innerHTML,
            keywords: excerciseNode.querySelector('.meta-keywords').innerHTML}
        );

        info.classList.add('opened');

        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () { 
            kach.selectTraining(info);
        });

        let images = info.querySelectorAll('img');
        images.forEach(function (el) {
            el.src = el.dataset.src;
        });

        let galleryItems = info.querySelectorAll('.info_gallery-item');
        galleryItems.forEach(function (el) {
            el.addEventListener('click', function () {
                galleryItems.forEach(function (el) {
                    el.classList.remove('info_gallery-item__active');
                });

                el.classList.add('info_gallery-item__active');
                el.children[0].click();
            })
        });
        
        let tags = excerciseNode.dataset['tags'].split(', '),
            tagsNode = info.querySelector('.tags');
        
        tags.forEach(function (el) {
            let newTag = utils.createElement('a', 'tag', el, {href: '#', onclick: UI.showExcercises})
            tagsNode.appendChild(newTag);
        });

        excercises.classList.remove('excercises__visible');                
        window.instgrm.Embeds.process();
    
    },

    loadExcercises: function () {
        fetch('https://' + window.location.host + '/Content/excercises.xml', {
            method: 'GET',
            headers: { 'Content-Type': 'application/xml' }
        })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            xml.innerHTML = data;
            new Search();
            Routing.loadPage(window.location.pathname);
        })
        .catch(function (error) {
            console.log('Cant load xml');
            console.log(error);
        });
        
    },

    showExcercises: function (e) {
        let musculeName = this.dataset.muscle || this.innerHTML,
            html = xml.querySelectorAll('.' + musculeName + ', [data-tags*="' + musculeName + '"]');
        
        e.preventDefault();
        excercises.innerHTML = '';
        for (var i = 0; i < html.length; i++) {
            var excercise = utils.createElement('li', 'excercise-name', html[i].querySelector('.excercise-name').innerHTML, {onclick: UI.showInfo});
            excercise.dataset['complexity'] = html[i].getAttribute('data-complexity');
            excercise.dataset['excersice'] = html[i].id;

            //excercise.addEventListener('mousedown', touch.moveExcerciseStart);
            //excercise.addEventListener('touchstart', touch.moveExcerciseStart);

            excercises.appendChild(excercise);
        }
        excercises.classList.add('excercises__visible');
        
    },

    hideExcercises: function() {
        excercises.classList.remove('excercises__visible');
    },

    loadAvatar: function () {
        if (utils.isSet(localStorage.avatarUrl)) {
            avatar.src = localStorage.avatarUrl;
        } else if (isAuthorized) {
            gapi.client.init({
                'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
                'clientId': '676405800702-43q3jac4kqbii78partduenvd1utnmmh.apps.googleusercontent.com',
                'clientSecret': "IUAw3wl1FvavbTl0lGvc6Bp_",
                'scope': 'profile',
            }).then(function () {
                return gapi.client.people.people.get({
                    resourceName: 'people/me'
                });
            }).then(function (response) {
                //console.log(response.result);
                localStorage.avatarUrl = response.result.photos[0].url;
                avatar.src = response.result.photos[0].url;
            }, function (reason) {
                console.log('Error: ' + reason.result.error.message);
            });
        }
    },

    clearLocalStorage: function(e) {
        if (e.keyCode == 76) {
            localStorage.clear();
            location.reload(false);
        }
    },

    init: function (e) {
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
        deleteTraining.addEventListener('click', Training.delete);
        copyTraining.addEventListener('click', Training.copy);

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

        window.onload = function () {
            gapi.load('client', UI.loadAvatar);
        }
    }
}