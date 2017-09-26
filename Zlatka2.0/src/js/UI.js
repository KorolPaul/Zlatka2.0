
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
        
        if (utils.isSet(e)) {
            e.preventDefault();
        }

        Routing.setPage('info', '/excercises/' + excerciseNode.id, {
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
        //window.instgrm.Embeds.process();
    },

    hideInfo: function () {
        info.classList.remove('opened');
    },

    loadExcercises: function () {
        xml.innerHTML = document.querySelector('#excercises-list').innerHTML;
        new Search();
        
        Routing.loadPage(window.location);
        /*
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
            
            Routing.loadPage(window.location.hash);
        })
        .catch(function (error) {
            console.log('Cant load xml');
            console.log(error);
        });
        */
    },

    showExcercises: function (e) {
        let musculeName = this.dataset.muscle || this.innerHTML,
            html = xml.querySelectorAll('li.' + musculeName + ', [data-tags*="' + musculeName + '"]');

        e.preventDefault();

        excercises.innerHTML = '';
        for (let i = 0; i < html.length; i++) {
            let excerciseLi = utils.createElement('li', 'excercise-name'),
                excerciseLink = utils.createElement('a', 'excercise-name_link', html[i].querySelector('.excercise-name').innerHTML, {onclick: UI.showInfo});
            
            excerciseLink.href = '#!' + html[i].id;
            excerciseLink.dataset['excersice'] = html[i].id;
            excerciseLi.dataset['complexity'] = html[i].getAttribute('data-complexity');

            //excercise.addEventListener('mousedown', touch.moveExcerciseStart);
            //excercise.addEventListener('touchstart', touch.moveExcerciseStart);

            excerciseLi.appendChild(excerciseLink);
            excercises.appendChild(excerciseLi);
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
            UI.hideInfo();
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

        window.addEventListener('popstate', () => {
            Routing.loadPage(location.pathname);
        });

        window.onload = function () {
            gapi.load('client', UI.loadAvatar);
        }
        UI.printStackTrace()
        
    },

    
    printStackTrace: function() {
        var callstack = [];
        var isCallstackPopulated = false;
        try {
            i.dont.exist+=0; //does not exist - that's the point
        } catch(e) {
            if (e.stack) { //Firefox
                var lines = e.stack.split("n");
                for (var i = 0, len = lines.length; i < len; i++) {
                        callstack.push(lines[i]);
                }
                //Remove call to printStackTrace()
                callstack.shift();
                isCallstackPopulated = true;
            }
            else if (window.opera && e.message) { //Opera
                var lines = e.message.split("n");
                for (var i = 0, len = lines.length; i < len; i++) {
                        var entry = lines[i];
                        //Append next line also since it has the file info
                        if (lines[i+1]) {
                            entry += " at " + lines[i+1];
                            i++;
                        callstack.push(entry);
                    }
                }
                //Remove call to printStackTrace()
                callstack.shift();
                isCallstackPopulated = true;
            }
        }
        if (!isCallstackPopulated) { //IE and Safari
            var currentFunction = arguments.callee.caller;
            while (currentFunction) {
                var fn = currentFunction.toString();
                //If we can't get the function name set to "anonymous"
                var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf("(")) || "anonymous";
                callstack.push(fname);
                currentFunction = currentFunction.caller;
            }
        }
        output(callstack);

        function output(arr) {
            let container = document.createElement('div');
            
            container.style.color = 'red';
            container.style.position = 'fixed';
            container.style.background = '#eee';
            container.style.padding = '2em';
            container.style.top = '1em';
            container.style.left = '1em';
            container.innerHTML = arr.join("nn");
    
    
            document.body.appendChild(container);
        }
    }


}