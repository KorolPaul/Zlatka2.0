"use strict";

var kach = {

    calculateComplexity: function calculateComplexity(training, complexity) {
        training.dataset.complexity = parseInt(training.dataset.complexity) + parseInt(complexity);
        training.className = 'training droppable';

        if (training.dataset.complexity > 20) training.classList.add("easy");
        if (training.dataset.complexity > 40) training.classList.add("normal");
        if (training.dataset.complexity > 50) training.classList.add("hard");
        if (training.dataset.complexity > 60) training.classList.add("insane");
    },

    validateSets: function validateSets(e) {
        if (/[0-9]/.test(e.key)) {
            Training.saveProgram();
        } else if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39) {
            e.preventDefault();
        }
    },

    selectTraining: function selectTraining(html) {
        var newExcerciseName = utils.createElement('span', 'training_excercise', html.querySelector('.excercise-name').innerText),
            newExcerciseInfo = utils.createElement('div', '', html.querySelector('.sets').innerHTML),
            trainingsList = document.querySelectorAll('.trainings_item:not(#trainings-settings)  .trainings_name');

        trainingsPopup.innerHTML = '';

        var _loop = function _loop(i) {
            var li = utils.createElement('li', 'trainings-popup_item', trainingsList[i].innerText, { onclick: function onclick() {
                    var newExcercise = new Excercise(li, newExcerciseName, newExcerciseInfo);
                } });
            trainingsPopup.appendChild(li);
        };

        for (var i = 0; i < trainingsList.length; i++) {
            _loop(i);
        }
        trainingsPopup.classList.add('trainings-popup__visible');
    }
};
/*
window.onload = function () {
    var stats = document.getElementById('stats');

    if (localStorage.stats !== undefined) {
        stats.innerHTML = localStorage.stats;
    }

    var cells = stats.querySelectorAll('td');
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('input', saveStats, false);
    }

    generatePlots();
}

function saveStats() {
    localStorage.stats = stats.innerHTML;
    document.getElementById('plots').innerHTML = '';
    generatePlots();
}

function drawPlot(title, index) {
    var plotItem = document.createElement('div'),
        plotHolder = document.createElement('div');

    plotItem.classList.add('plots_item');
    plotHolder.classList.add('plots_holder');
    plotItem.innerHTML = '<h2 class="plots_header">' + title + '</h2>';

    plotItem.appendChild(plotHolder);
    document.getElementById('plots').appendChild(plotItem);

    var tableData = document.querySelectorAll('.statistics tr:nth-child(' + index + ') td:not(.chart-name)'),
        stats = [['Месяц', title]];

    for (var i = 0; i < tableData.length; i++) {
        stats.push([i + 1, parseInt(tableData[i].textContent)]);
    }

    var data = new google.visualization.arrayToDataTable(stats);
    var options = {
        height: 400,
        curveType: 'function',
        legend: 'none',
        animation: {
            duration: 1000,
            easing: 'out',
            startup: true
        }
    };

    var chart = new google.visualization.LineChart(plotHolder);
    chart.draw(data, options);
}

function generatePlots() {
    var plots = document.getElementsByClassName('chart-name');
    for (var i = 0; i < plots.length; i++) {
        drawPlot(plots[i].textContent, i + 1);
    }
}
*/
"use strict";
'use strict';

var dragExcercise = void 0,
    dragExcerciseNext = void 0,
    mouseOffset = void 0;

var touch = {
    fixEvent: function fixEvent(e) {
        e = e || window.event;

        if (e.pageX == null && e.clientX != null) {
            var html = document.documentElement;
            var body = document.body;
            e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
            e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
        }

        if (!e.which && e.button) {
            e.which = e.button & 1 ? 1 : e.button & 2 ? 3 : e.button & 4 ? 2 : 0;
        }
        if (e.pageX == 0) {
            e = e.touches[0] || e.changedTouches[0];
        }

        return e;
    },

    getPosition: function getPosition(e) {
        var left = 0,
            top = 0;

        while (e.offsetParent) {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent;
        }

        left += e.offsetLeft;
        top += e.offsetTop;

        return { x: left, y: top };
    },

    moveExcerciseStart: function moveExcerciseStart(e) {
        e.preventDefault();
        e = touch.fixEvent(e);

        dragExcercise = this.cloneNode(true);
        dragExcercise.classList.add('temp');

        document.addEventListener('mousemove', touch.moveExcercise);
        document.addEventListener('mouseup', touch.moveExcerciseEnd);
        document.addEventListener('touchmove', touch.moveExcercise);
        document.addEventListener('touchend', touch.moveExcerciseEnd);

        document.body.appendChild(dragExcercise);

        var pos = getPosition(this);
        mouseOffset = {
            x: e.pageX - pos.x,
            y: e.pageY - pos.y
            //document.body.onselectstart = function () { return false };
        };return false;
    },

    moveExcercise: function moveExcercise(e) {
        e = fixEvent(e);

        dragExcercise.style.left = e.pageX - mouseOffset.x + 'px';
        dragExcercise.style.top = e.pageY - mouseOffset.y + 'px';
        if (dragExcerciseNext) {
            dragExcerciseNext = dragExcercise.nextSibling.nextSibling;
            dragExcerciseNext.style.marginTop = dragExcercise.offsetHeight + 'px';
            dragExcerciseNext.className += 'animated';
        }
    },

    moveExcerciseEnd: function moveExcerciseEnd(e) {
        e = fixEvent(e);
        var isDropped = false;
        for (var i = 0; i < trainings.length; i++) {
            var targ = trainings[i];
            var targPos = getPosition(targ);
            var targWidth = parseInt(targ.offsetWidth);
            var targHeight = parseInt(targ.offsetHeight);

            if (e.pageX > targPos.x && e.pageX < targPos.x + targWidth && e.pageY > targPos.y && e.pageY < targPos.y + targHeight) {
                dragExcercise.classList.remove('temp');
                addExcercise(targ, dragExcercise);
                isDropped = true;
            }
        }
        if (!isDropped && dragExcercise) dragExcercise.parentNode.removeChild(dragExcercise);

        if (dragExcerciseNext) dragExcerciseNext.style.marginTop = 0;

        dragExcercise = null;
        dragExcerciseNext = null;
        document.removeEventListener('mousemove', touch.moveExcercise);
        document.removeEventListener('mouseup', touch.moveExcerciseEnd);
        document.removeEventListener('touchmove', touch.moveExcercise);
        document.removeEventListener('touchend', touch.moveExcerciseEnd);
    }
};
'use strict';

var trainings = [],
    xml = document.createElement('div'),
    isTouchDevice = 'ontouchstart' in document.documentElement;

var info = void 0,
    infoClose = void 0,
    training = void 0,
    trainingsBlock = void 0,
    trainingsPopup = void 0,
    droppable = void 0,
    muscules = void 0,
    musculesSides = void 0,
    musculesList = void 0,
    musculeTitles = void 0,
    excercise = void 0,
    excercises = void 0,
    excerciseSetsHolder = void 0,
    avatar = void 0,
    menuTrigger = void 0,
    menuPopup = void 0,
    sheduleElement = void 0;

var deleteExcercise = document.getElementById('delete-excercise'),
    copyExcercise = document.getElementById('copy-excercise'),
    deleteTraining = document.getElementById('delete-training'),
    copyTraining = document.getElementById('copy-training'),
    closeExcercise = document.getElementById('close-excercise'),
    copyPopup = document.getElementById('copy-popup'),
    editPopup = document.getElementById('edit-popup'),
    addTrainingButtons = document.querySelectorAll('.addTraining');

var UI = {

    toggleMenu: function toggleMenu(e) {
        e.preventDefault();

        menuTrigger.classList.toggle('menu_trigger__opened');
        menuPopup.classList.toggle('menu_popup__opened');
    },

    showInfo: function showInfo(e, excercise) {
        var excerciseUrl = utils.isSet(excercise) ? excercise : this.dataset.excersice,
            excerciseNode = xml.querySelector('#' + excerciseUrl),
            html = excerciseNode.querySelector('.info').innerHTML;

        if (utils.isSet(e)) {
            e.preventDefault();
        }

        Routing.setPage('info', '/excercises/' + excerciseNode.id, {
            title: excerciseNode.querySelector('.excercise-name').innerHTML,
            descr: excerciseNode.querySelector('.meta-description').innerHTML,
            keywords: excerciseNode.querySelector('.meta-keywords').innerHTML
        });

        info.classList.add('opened');

        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () {
            kach.selectTraining(info);
        });

        var images = info.querySelectorAll('img');
        images.forEach(function (el) {
            el.src = el.dataset.src;
        });

        var galleryItems = info.querySelectorAll('.info_gallery-item');
        galleryItems.forEach(function (el) {
            el.addEventListener('click', function () {
                galleryItems.forEach(function (el) {
                    el.classList.remove('info_gallery-item__active');
                });

                el.classList.add('info_gallery-item__active');
                el.children[0].click();
            });
        });

        var tags = excerciseNode.dataset['tags'].split(', '),
            tagsNode = info.querySelector('.tags');

        tags.forEach(function (el) {
            var newTag = utils.createElement('a', 'tag', el, { href: '#', onclick: UI.showExcercises });
            tagsNode.appendChild(newTag);
        });

        excercises.classList.remove('excercises__visible');
        //window.instgrm.Embeds.process();
    },

    hideInfo: function hideInfo() {
        info.classList.remove('opened');
    },

    loadExcercises: function loadExcercises() {
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

    showExcercises: function showExcercises(e) {
        var musculeName = this.dataset.muscle || this.innerHTML,
            html = xml.querySelectorAll('li.' + musculeName + ', [data-tags*="' + musculeName + '"]');

        e.preventDefault();

        excercises.innerHTML = '';
        for (var i = 0; i < html.length; i++) {
            var excerciseLi = utils.createElement('li', 'excercise-name'),
                excerciseLink = utils.createElement('a', 'excercise-name_link', html[i].querySelector('.excercise-name').innerHTML, { onclick: UI.showInfo });

            excerciseLink.href = '/excercises/' + html[i].id;
            excerciseLink.dataset['excersice'] = html[i].id;
            excerciseLi.dataset['complexity'] = html[i].getAttribute('data-complexity');

            //excercise.addEventListener('mousedown', touch.moveExcerciseStart);
            //excercise.addEventListener('touchstart', touch.moveExcerciseStart);

            excerciseLi.appendChild(excerciseLink);
            excercises.appendChild(excerciseLi);
        }
        excercises.classList.add('excercises__visible');
    },

    hideExcercises: function hideExcercises() {
        excercises.classList.remove('excercises__visible');
    },

    loadAvatar: function loadAvatar() {
        if (utils.isSet(localStorage.avatarUrl)) {
            avatar.src = localStorage.avatarUrl;
        } else if (isAuthorized) {
            gapi.client.init({
                'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
                'clientId': '676405800702-43q3jac4kqbii78partduenvd1utnmmh.apps.googleusercontent.com',
                'clientSecret': "IUAw3wl1FvavbTl0lGvc6Bp_",
                'scope': 'profile'
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

    clearLocalStorage: function clearLocalStorage(e) {
        if (e.keyCode == 76) {
            localStorage.clear();
            location.reload(false);
        }
    },

    init: function init(e) {
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
        };

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

        window.addEventListener('popstate', function () {
            Routing.loadPage(location.pathname);
        });

        window.onload = function () {
            gapi.load('client', UI.loadAvatar);
        };
        UI.printStackTrace();

        document.querySelector('.excercise-name_link').addEventListener('click', function (e) {
            // alert(e.target.href.substring(e.target.href.indexOf('/ex')))
            e.preventDefault();
            Routing.setPage('info', e.target.href.substring(e.target.href.indexOf('/ex')), {
                title: e.target.innerHTML,
                descr: e.target.innerHTML,
                keywords: e.target.innerHTML
            });

            Routing.loadPage(window.location);
        });
    },

    printStackTrace: function printStackTrace() {
        var callstack = [];
        var isCallstackPopulated = false;
        try {
            i.dont.exist += 0; //does not exist - that's the point
        } catch (e) {
            if (e.stack) {
                //Firefox
                var lines = e.stack.split("n");
                for (var i = 0, len = lines.length; i < len; i++) {
                    callstack.push(lines[i]);
                }
                //Remove call to printStackTrace()
                callstack.shift();
                isCallstackPopulated = true;
            } else if (window.opera && e.message) {
                //Opera
                var lines = e.message.split("n");
                for (var i = 0, len = lines.length; i < len; i++) {
                    var entry = lines[i];
                    //Append next line also since it has the file info
                    if (lines[i + 1]) {
                        entry += " at " + lines[i + 1];
                        i++;
                        callstack.push(entry);
                    }
                }
                //Remove call to printStackTrace()
                callstack.shift();
                isCallstackPopulated = true;
            }
        }
        if (!isCallstackPopulated) {
            //IE and Safari
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
            var container = document.createElement('div');

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

};
'use strict';

var utils = {
    createElement: function createElement(type, className, content, attributes) {
        var el = document.createElement(type);

        if (className) {
            el.classList.add(className);
        }
        if (content) {
            el.innerHTML = content;
        }

        for (var key in attributes) {
            el[key] = attributes[key];
        }

        return el;
    },

    index: function index(el) {
        var children = el.parentNode.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] === el) {
                return i + 1;
            }
        }

        return -1;
    },

    addEvent: function addEvent(el, events, handler) {
        for (var i = 0; i < events.length; i++) {
            el.addEventListener(events[i], handler);
        }
    },

    removeEvent: function removeEvent(el, events, handler) {
        for (var i = 0; i < events.length; i++) {
            el.removeEventListener(events[i], handler);
        }
    },

    addClassToElements: function addClassToElements(elements, className) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add(className);
        }
    },

    removeClassFromElements: function removeClassFromElements(elements, className) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove(className);
        }
    },

    isSet: function isSet(obj) {
        return typeof obj !== 'undefined' && obj !== null;
    }
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FRAMES_COUNT = 11,
    //document.querySelector('.muscles_side').lenght
sliderElements = document.querySelectorAll('#slider path');

var motionFrame = 0,
    motionDelay = 85,
    musclesMap = void 0,
    musculeTitles = void 0;

var Body = function () {
    function Body() {
        _classCallCheck(this, Body);

        var musclesElement = document.querySelector('.muscles'),
            hammerMap = new Hammer(musclesElement);

        musclesMap = document.getElementById('map');
        musculeTitles = document.querySelectorAll('.muscles_title');

        musclesElement.addEventListener('wheel', Body.scroll);
        hammerMap.on('swipe', Body.swipe);
    }

    _createClass(Body, null, [{
        key: 'scroll',
        value: function scroll(e) {
            var isScrollUp = (e.deltaY || e.detail || e.wheelDelta) > 0;

            if (isScrollUp) {
                motionFrame < FRAMES_COUNT ? motionFrame++ : motionFrame = 0;
            } else {
                motionFrame > 0 ? motionFrame-- : motionFrame = FRAMES_COUNT;
            }

            Body.rotateBody();
        }
    }, {
        key: 'rotateBody',
        value: function rotateBody() {
            musclesMap.style.backgroundPositionX = motionFrame * 9.1 + "%";

            utils.removeClassFromElements(musculeTitles, 'muscles_title__visible');
            utils.addClassToElements(document.querySelectorAll('.muscles_title[data-layer="' + motionFrame + '"]'), 'muscles_title__visible');

            utils.removeClassFromElements(musculesSides, 'active');
            musculesSides[motionFrame].classList.add('active');

            utils.removeClassFromElements(sliderElements, 'active');
            utils.addClassToElements(document.querySelectorAll('#slider path[data-layer="' + motionFrame + '"]'), 'active');
        }
    }, {
        key: 'swipe',
        value: function swipe(e) {
            switch (e.direction) {
                case 2:
                    //left
                    motionFrame < FRAMES_COUNT ? motionFrame++ : motionFrame = 0;
                    break;

                case 4:
                    //right
                    motionFrame > 0 ? motionFrame-- : motionFrame = FRAMES_COUNT;
                    break;
            }

            Body.rotateBody();
            if (!document.querySelector('.muscles_title__visible[data-layer]')) {
                setTimeout(function () {
                    Body.swipe(e);
                }, motionDelay);
            }
        }
    }]);

    return Body;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Excercise = function () {
    function Excercise(e, excercise, excerciseInfo) {
        _classCallCheck(this, Excercise);

        Excercise.add(utils.index(e), excercise, excerciseInfo);
        trainingsPopup.classList.remove('trainings-popup__visible');
    }

    _createClass(Excercise, null, [{
        key: 'add',
        value: function add(trainingIndex, excercise, excerciseInfo) {
            var newExcerciseItem = utils.createElement('li', 'training_item', null),
                name = utils.createElement('span', 'training_excercise', excercise.innerHTML),
                sets = utils.createElement('ul', 'sets', excerciseInfo.innerHTML);

            newExcerciseItem.appendChild(name);
            newExcerciseItem.appendChild(sets);
            newExcerciseItem.dataset.id = 'training' + Math.random() * 10;

            document.querySelector('.trainings_item:nth-child(' + trainingIndex + ') .trainings_excercises').appendChild(newExcerciseItem);
            Training.saveProgram();
        }
    }, {
        key: 'show',
        value: function show(e) {
            excercise.classList.add('excercise__visible');
            excerciseSetsHolder.innerHTML = e.currentTarget.innerHTML;

            var excerciseRanges = excerciseSetsHolder.querySelectorAll('input[type="range"]');
            for (var i = 0; i < excerciseRanges.length; i++) {
                excerciseRanges[i].addEventListener('input', Excercise.changeValue);
            }

            deleteExcercise.dataset.id = e.currentTarget.dataset.id;
            copyExcercise.dataset.id = e.currentTarget.dataset.id;
        }
    }, {
        key: 'delete',
        value: function _delete() {
            var trainingElements = document.querySelectorAll('.training_item[data-id="' + deleteExcercise.dataset.id + '"]');

            trainingElements.forEach(function (el) {
                el.remove();
            });

            Excercise.close();
            Training.saveProgram();
        }
    }, {
        key: 'showCopyPopup',
        value: function showCopyPopup() {
            var trainingsList = document.querySelectorAll('.trainings_item:not(#trainings-settings)'),
                copyListHolder = document.getElementById('copy-list');

            copyListHolder.innerHTML = '';

            trainingsList.forEach(function (el) {
                var excercisesCount = el.querySelectorAll('.training_item').length,
                    newTraining = utils.createElement('li', 'edit-popup_list-item', el.querySelector('.trainings_name').innerText, { onclick: function onclick() {
                        Excercise.copy(utils.index(el));
                    } });

                newTraining.appendChild(utils.createElement('p', 'edit-popup_count', excercisesCount + ' упражнений'));
                copyListHolder.appendChild(newTraining);
            });
            copyPopup.classList.add('edit-popup__opened');
        }
    }, {
        key: 'hideCopyPopup',
        value: function hideCopyPopup(e) {
            if (e) {
                e.preventDefault();
            }

            copyPopup.classList.remove('edit-popup__opened');
        }
    }, {
        key: 'copy',
        value: function copy(trainingIndex) {
            Excercise.add(trainingIndex, trainingsBlock.querySelector('.training_item[data-id="' + copyExcercise.dataset.id + '"] .training_excercise'), trainingsBlock.querySelector('.training_item[data-id="' + copyExcercise.dataset.id + '"] .sets'));

            Excercise.hideCopyPopup();
        }
    }, {
        key: 'close',
        value: function close() {
            excercise.classList.remove('excercise__visible');

            var sets = document.querySelectorAll('.training_item[data-id="' + deleteExcercise.dataset.id + '"] .sets'),
                html = excerciseSetsHolder.querySelector('.sets').innerHTML;
            for (var i = 0; i < sets.length; i++) {
                sets[i].innerHTML = html;
            }
            Training.saveProgram();
        }
    }, {
        key: 'changeValue',
        value: function changeValue(e) {
            var input = e.target.name;
            excerciseSetsHolder.querySelector('span[name="' + input + '"]').innerText = e.target.value;
        }
    }]);

    return Excercise;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Routing = function () {
    function Routing() {
        _classCallCheck(this, Routing);
    }

    _createClass(Routing, null, [{
        key: 'setPage',
        value: function setPage(title, url, meta) {
            if (utils.isSet(meta)) {
                document.title = meta.title;
                document.querySelector('meta[name="description"]').content = meta.descr;
                document.querySelector('meta[name="keywords"]').content = meta.keywords;
            } else if (url === '/') {
                document.title = 'Muscules.by - ваш персональный тренер';
                document.querySelector('meta[name="description"]').content = 'Ваш персональный тренер';
                document.querySelector('meta[name="keywords"]').content = 'тренировки, бодибилдинг, упражнения, мышцы';
            }
            history.pushState({}, title, window.location.protocol + '//' + window.location.host + url);
            document.querySelector('link[rel="canonical"]').href = window.location.toString();
        }
    }, {
        key: 'loadPage',
        value: function loadPage(url) {
            if (url.pathname.indexOf('excercises') != -1) {
                UI.showInfo(null, url.pathname.substring(12));
            } else if (url === '/') {
                UI.hideInfo();
            }
            document.querySelector('link[rel="canonical"]').href = window.location.toString();
        }
    }]);

    return Routing;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var allTags = void 0,
    searchElement = document.getElementById('search');

var Search = function () {
    function Search() {
        _classCallCheck(this, Search);

        allTags = Search.getTags();
        Search.showTags(allTags);

        Search.showExcersices(this, 'li[id]');

        document.querySelector('.search_input').addEventListener('input', Search.sortExcersises);
    }

    _createClass(Search, null, [{
        key: 'getTags',
        value: function getTags() {
            var tagsElements = xml.querySelectorAll('[data-tags]'),
                tagsString = '',
                tags = [];

            tagsElements.forEach(function (el) {
                tagsString += el.dataset.tags + ', ';
            });
            tagsString = tagsString.split(', ');

            tagsString.forEach(function (el) {
                var isDouble = false;

                tags.forEach(function (el2) {
                    if (el === el2) {
                        isDouble = true;
                    }
                });

                if (!isDouble && el) {
                    tags.push(el);
                }
            });

            return tags;
        }
    }, {
        key: 'showTags',
        value: function showTags(tagElements) {
            var tagsHolder = document.querySelector('.search_tags');
            tagElements.forEach(function (el) {
                var newTag = utils.createElement('a', 'tag', el, { href: '#', onclick: Search.showExcersices });
                tagsHolder.appendChild(newTag);
            });
        }
    }, {
        key: 'showExcersices',
        value: function showExcersices(e, selector, textQuery) {
            var excercisesHolder = document.querySelector('.search_excercises'),
                excercisesList = void 0;

            if (selector) {
                excercisesList = xml.querySelectorAll(selector);
            } else {
                e.preventDefault();
                excercisesList = xml.querySelectorAll('.' + this.innerHTML + ', [data-tags*="' + this.innerHTML + '"    ]');
            }

            excercisesHolder.innerHTML = '';
            excercisesList.forEach(function (el) {
                var excerciseName = el.querySelector('.excercise-name').innerHTML;
                if (!textQuery || excerciseName.indexOf(textQuery) != -1) {
                    var excercise = utils.createElement('li', 'excercise-name', excerciseName, { onclick: UI.showInfo });
                    excercise.dataset['complexity'] = el.getAttribute('data-complexity');
                    excercise.dataset['excersice'] = el.id;

                    excercisesHolder.appendChild(excercise);
                } else {
                    excercisesHolder.innerHTML = '<h3>Ничего не найдено</h3>';
                }
            });
        }
    }, {
        key: 'sortExcersises',
        value: function sortExcersises(e) {
            Search.showExcersices(null, 'li[id]', e.target.value);
        }
    }, {
        key: 'showPopup',
        value: function showPopup() {
            searchElement.classList.add('search__opened');
        }
    }, {
        key: 'hidePopup',
        value: function hidePopup() {
            searchElement.classList.remove('search__opened');
        }
    }]);

    return Search;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Training = function () {
    function Training(name) {
        _classCallCheck(this, Training);

        this.name = name;
    }

    _createClass(Training, [{
        key: 'render',
        value: function render(html) {
            var newTraining = utils.createElement('li', 'trainings_item'),
                trainingLink = utils.createElement('a', 'trainings_name', this.name, { href: '#', onclick: Training.showExcercises }),
                trainingContent = utils.createElement('ul', 'trainings_excercises');

            //newTraining.classList.add('droppable');
            //newTraining.classList.add('new');

            if (html) {
                trainingContent.innerHTML = html;
            }

            newTraining.appendChild(trainingLink);
            newTraining.appendChild(trainingContent);

            document.querySelector(".trainings").insertBefore(newTraining, document.querySelector('#trainings-settings'));
            //trainings.push(newTraining);

            var elements = document.querySelectorAll('#trainings *');

            for (var i = 0; i < elements.length; i++) {
                if (typeof elements[i].onclick == "function") {
                    elements[i].dataset.handler = 'Training.' + elements[i].onclick.name;
                }
            }
        }
    }], [{
        key: 'add',
        value: function add() {
            var newTraining = new Training(prompt('Введите название тренировки'));
            newTraining.render();
            Training.saveProgram();
        }
    }, {
        key: 'addExcercise',
        value: function addExcercise(e, excercise, excerciseInfo) {
            var excerciseName = utils.createElement('li', 'training_item', null),
                sets = utils.createElement('ul', 'sets', excerciseInfo.innerHTML);

            excerciseName.appendChild(excercise);
            excerciseName.appendChild(sets);

            document.querySelector('.trainings_item:nth-child(' + utils.index(e) + ') .trainings_excercises').appendChild(excerciseName);
            trainingsPopup.classList.remove('trainings-popup__visible');

            Training.saveProgram();
        }
    }, {
        key: 'showExcercises',
        value: function showExcercises(e) {
            training.innerHTML = document.querySelector('.trainings_item:nth-of-type(' + utils.index(e.target.parentNode) + ') .trainings_excercises').innerHTML;

            var trainingItems = document.querySelectorAll('.training .training_item, .training .button');
            trainingItems.forEach(function (el) {
                if (el.dataset.handler) {
                    el.addEventListener('click', eval(el.dataset.handler));
                } else {
                    el.addEventListener('click', Excercise.show);
                }
            });
        }
    }, {
        key: 'saveProgram',
        value: function saveProgram() {
            fetch('/Training/SaveTraining', {
                body: JSON.stringify({ content: trainingsBlock.innerHTML.replace(/</g, '&lt;') }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                credentials: 'same-origin'
            }).then(function (response) {
                return response.text();
            }).then(function (body) {
                console.log(body);
            }).catch(function () {
                console.log('Cant save data');
            });

            localStorage.trainingProgram = trainingsBlock.innerHTML;
        }
    }, {
        key: 'loadProgram',
        value: function loadProgram() {
            if (localStorage.trainingProgram !== undefined) {
                trainingsBlock.innerHTML = localStorage.trainingProgram;
                addHandlers();
            } else {
                fetch('/Training/LoadTraining', {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                    credentials: 'same-origin'
                }).then(function (response) {
                    return response.text();
                }).then(function (data) {
                    var html = data.replace(/(\\u0026lt;)/g, '<');
                    html = html.replace(/(\\")/g, '"');
                    html = html.replace(/(\\n)/g, '');
                    html = html.replace(/(\\u003e)/g, '>');

                    if (html != "") {
                        trainingsBlock.innerHTML = html.substring(1, html.length - 1);
                    }
                    addHandlers();
                }).catch(function (error) {
                    console.log(error);
                });
            }

            function addHandlers() {
                var elements = document.querySelectorAll('#trainings *');

                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].dataset.handler) {
                        elements[i].addEventListener('click', eval(elements[i].dataset.handler));
                    }
                }
            }
        }
    }, {
        key: 'showPopup',
        value: function showPopup() {
            sheduleElement.classList.add('shedule__opened');
        }
    }, {
        key: 'hidePopup',
        value: function hidePopup() {
            sheduleElement.classList.remove('shedule__opened');
        }
    }, {
        key: 'showEditPopup',
        value: function showEditPopup() {
            var trainingsList = document.querySelectorAll('.trainings_item:not(#trainings-settings)'),
                editListHolder = document.getElementById('edit-list'),
                checkboxIndex = 1;

            editListHolder.innerHTML = '';

            trainingsList.forEach(function (el) {
                var excercisesCount = el.querySelectorAll('.training_item').length,
                    checkbox = utils.createElement('input', 'edit-popup_checkbox', null, { type: 'checkbox', name: 'training', id: 'ch' + checkboxIndex }),
                    label = utils.createElement('label', 'edit-popup_label', el.querySelector('.trainings_name').innerText, { htmlFor: 'ch' + checkboxIndex }),
                    newTraining = utils.createElement('li', 'edit-popup_list-item');

                label.appendChild(utils.createElement('p', 'edit-popup_count', excercisesCount + ' упражнений'));
                newTraining.appendChild(checkbox);
                newTraining.appendChild(label);

                editListHolder.appendChild(newTraining);

                checkboxIndex++;
            });

            editPopup.classList.add('edit-popup__opened');
        }
    }, {
        key: 'hideEditPopup',
        value: function hideEditPopup(e) {
            if (e) {
                e.preventDefault();
            }

            editPopup.classList.remove('edit-popup__opened');
        }
    }, {
        key: 'copy',
        value: function copy() {
            var selectedTrainings = document.querySelectorAll('.edit-popup_checkbox:checked'),
                editListHolder = document.getElementById('edit-list');

            selectedTrainings.forEach(function (el) {
                var newTraining = new Training(el.parentElement.querySelector('label').childNodes[0].textContent);
                newTraining.render(document.querySelector('.trainings_item:nth-child(' + utils.index(el.parentElement) + ') .trainings_excercises').innerHTML);

                Training.showEditPopup();
            });

            Training.saveProgram();
        }
    }, {
        key: 'delete',
        value: function _delete() {
            var selectedTrainings = document.querySelectorAll('.edit-popup_checkbox:checked');

            selectedTrainings.forEach(function (el) {
                document.querySelector('.trainings_item:nth-child(' + utils.index(el.parentElement) + ')').remove();
                el.parentElement.remove();
            });

            Training.saveProgram();
        }
    }]);

    return Training;
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function (a, b, c, d) {
  "use strict";
  function e(a, b, c) {
    return setTimeout(j(a, c), b);
  }function f(a, b, c) {
    return Array.isArray(a) ? (g(a, c[b], c), !0) : !1;
  }function g(a, b, c) {
    var e;if (a) if (a.forEach) a.forEach(b, c);else if (a.length !== d) for (e = 0; e < a.length;) {
      b.call(c, a[e], e, a), e++;
    } else for (e in a) {
      a.hasOwnProperty(e) && b.call(c, a[e], e, a);
    }
  }function h(b, c, d) {
    var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";return function () {
      var c = new Error("get-stack-trace"),
          d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
          f = a.console && (a.console.warn || a.console.log);return f && f.call(a.console, e, d), b.apply(this, arguments);
    };
  }function i(a, b, c) {
    var d,
        e = b.prototype;d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && la(d, c);
  }function j(a, b) {
    return function () {
      return a.apply(b, arguments);
    };
  }function k(a, b) {
    return (typeof a === "undefined" ? "undefined" : _typeof(a)) == oa ? a.apply(b ? b[0] || d : d, b) : a;
  }function l(a, b) {
    return a === d ? b : a;
  }function m(a, b, c) {
    g(q(b), function (b) {
      a.addEventListener(b, c, !1);
    });
  }function n(a, b, c) {
    g(q(b), function (b) {
      a.removeEventListener(b, c, !1);
    });
  }function o(a, b) {
    for (; a;) {
      if (a == b) return !0;a = a.parentNode;
    }return !1;
  }function p(a, b) {
    return a.indexOf(b) > -1;
  }function q(a) {
    return a.trim().split(/\s+/g);
  }function r(a, b, c) {
    if (a.indexOf && !c) return a.indexOf(b);for (var d = 0; d < a.length;) {
      if (c && a[d][c] == b || !c && a[d] === b) return d;d++;
    }return -1;
  }function s(a) {
    return Array.prototype.slice.call(a, 0);
  }function t(a, b, c) {
    for (var d = [], e = [], f = 0; f < a.length;) {
      var g = b ? a[f][b] : a[f];r(e, g) < 0 && d.push(a[f]), e[f] = g, f++;
    }return c && (d = b ? d.sort(function (a, c) {
      return a[b] > c[b];
    }) : d.sort()), d;
  }function u(a, b) {
    for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ma.length;) {
      if (c = ma[g], e = c ? c + f : b, e in a) return e;g++;
    }return d;
  }function v() {
    return ua++;
  }function w(b) {
    var c = b.ownerDocument || b;return c.defaultView || c.parentWindow || a;
  }function x(a, b) {
    var c = this;this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) {
      k(a.options.enable, [a]) && c.handler(b);
    }, this.init();
  }function y(a) {
    var b,
        c = a.options.inputClass;return new (b = c ? c : xa ? M : ya ? P : wa ? R : L)(a, z);
  }function z(a, b, c) {
    var d = c.pointers.length,
        e = c.changedPointers.length,
        f = b & Ea && d - e === 0,
        g = b & (Ga | Ha) && d - e === 0;c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, A(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c;
  }function A(a, b) {
    var c = a.session,
        d = b.pointers,
        e = d.length;c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1);var f = c.firstInput,
        g = c.firstMultiple,
        h = g ? g.center : f.center,
        i = b.center = E(d);b.timeStamp = ra(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = I(h, i), b.distance = H(h, i), B(c, b), b.offsetDirection = G(b.deltaX, b.deltaY);var j = F(b.deltaTime, b.deltaX, b.deltaY);b.overallVelocityX = j.x, b.overallVelocityY = j.y, b.overallVelocity = qa(j.x) > qa(j.y) ? j.x : j.y, b.scale = g ? K(g.pointers, d) : 1, b.rotation = g ? J(g.pointers, d) : 0, b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length, C(c, b);var k = a.element;o(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k;
  }function B(a, b) {
    var c = b.center,
        d = a.offsetDelta || {},
        e = a.prevDelta || {},
        f = a.prevInput || {};b.eventType !== Ea && f.eventType !== Ga || (e = a.prevDelta = { x: f.deltaX || 0, y: f.deltaY || 0 }, d = a.offsetDelta = { x: c.x, y: c.y }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y);
  }function C(a, b) {
    var c,
        e,
        f,
        g,
        h = a.lastInterval || b,
        i = b.timeStamp - h.timeStamp;if (b.eventType != Ha && (i > Da || h.velocity === d)) {
      var j = b.deltaX - h.deltaX,
          k = b.deltaY - h.deltaY,
          l = F(i, j, k);e = l.x, f = l.y, c = qa(l.x) > qa(l.y) ? l.x : l.y, g = G(j, k), a.lastInterval = b;
    } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g;
  }function D(a) {
    for (var b = [], c = 0; c < a.pointers.length;) {
      b[c] = { clientX: pa(a.pointers[c].clientX), clientY: pa(a.pointers[c].clientY) }, c++;
    }return { timeStamp: ra(), pointers: b, center: E(b), deltaX: a.deltaX, deltaY: a.deltaY };
  }function E(a) {
    var b = a.length;if (1 === b) return { x: pa(a[0].clientX), y: pa(a[0].clientY) };for (var c = 0, d = 0, e = 0; b > e;) {
      c += a[e].clientX, d += a[e].clientY, e++;
    }return { x: pa(c / b), y: pa(d / b) };
  }function F(a, b, c) {
    return { x: b / a || 0, y: c / a || 0 };
  }function G(a, b) {
    return a === b ? Ia : qa(a) >= qa(b) ? 0 > a ? Ja : Ka : 0 > b ? La : Ma;
  }function H(a, b, c) {
    c || (c = Qa);var d = b[c[0]] - a[c[0]],
        e = b[c[1]] - a[c[1]];return Math.sqrt(d * d + e * e);
  }function I(a, b, c) {
    c || (c = Qa);var d = b[c[0]] - a[c[0]],
        e = b[c[1]] - a[c[1]];return 180 * Math.atan2(e, d) / Math.PI;
  }function J(a, b) {
    return I(b[1], b[0], Ra) + I(a[1], a[0], Ra);
  }function K(a, b) {
    return H(b[0], b[1], Ra) / H(a[0], a[1], Ra);
  }function L() {
    this.evEl = Ta, this.evWin = Ua, this.pressed = !1, x.apply(this, arguments);
  }function M() {
    this.evEl = Xa, this.evWin = Ya, x.apply(this, arguments), this.store = this.manager.session.pointerEvents = [];
  }function N() {
    this.evTarget = $a, this.evWin = _a, this.started = !1, x.apply(this, arguments);
  }function O(a, b) {
    var c = s(a.touches),
        d = s(a.changedTouches);return b & (Ga | Ha) && (c = t(c.concat(d), "identifier", !0)), [c, d];
  }function P() {
    this.evTarget = bb, this.targetIds = {}, x.apply(this, arguments);
  }function Q(a, b) {
    var c = s(a.touches),
        d = this.targetIds;if (b & (Ea | Fa) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];var e,
        f,
        g = s(a.changedTouches),
        h = [],
        i = this.target;if (f = c.filter(function (a) {
      return o(a.target, i);
    }), b === Ea) for (e = 0; e < f.length;) {
      d[f[e].identifier] = !0, e++;
    }for (e = 0; e < g.length;) {
      d[g[e].identifier] && h.push(g[e]), b & (Ga | Ha) && delete d[g[e].identifier], e++;
    }return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0;
  }function R() {
    x.apply(this, arguments);var a = j(this.handler, this);this.touch = new P(this.manager, a), this.mouse = new L(this.manager, a), this.primaryTouch = null, this.lastTouches = [];
  }function S(a, b) {
    a & Ea ? (this.primaryTouch = b.changedPointers[0].identifier, T.call(this, b)) : a & (Ga | Ha) && T.call(this, b);
  }function T(a) {
    var b = a.changedPointers[0];if (b.identifier === this.primaryTouch) {
      var c = { x: b.clientX, y: b.clientY };this.lastTouches.push(c);var d = this.lastTouches,
          e = function e() {
        var a = d.indexOf(c);a > -1 && d.splice(a, 1);
      };setTimeout(e, cb);
    }
  }function U(a) {
    for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) {
      var e = this.lastTouches[d],
          f = Math.abs(b - e.x),
          g = Math.abs(c - e.y);if (db >= f && db >= g) return !0;
    }return !1;
  }function V(a, b) {
    this.manager = a, this.set(b);
  }function W(a) {
    if (p(a, jb)) return jb;var b = p(a, kb),
        c = p(a, lb);return b && c ? jb : b || c ? b ? kb : lb : p(a, ib) ? ib : hb;
  }function X() {
    if (!fb) return !1;var b = {},
        c = a.CSS && a.CSS.supports;return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (d) {
      b[d] = c ? a.CSS.supports("touch-action", d) : !0;
    }), b;
  }function Y(a) {
    this.options = la({}, this.defaults, a || {}), this.id = v(), this.manager = null, this.options.enable = l(this.options.enable, !0), this.state = nb, this.simultaneous = {}, this.requireFail = [];
  }function Z(a) {
    return a & sb ? "cancel" : a & qb ? "end" : a & pb ? "move" : a & ob ? "start" : "";
  }function $(a) {
    return a == Ma ? "down" : a == La ? "up" : a == Ja ? "left" : a == Ka ? "right" : "";
  }function _(a, b) {
    var c = b.manager;return c ? c.get(a) : a;
  }function aa() {
    Y.apply(this, arguments);
  }function ba() {
    aa.apply(this, arguments), this.pX = null, this.pY = null;
  }function ca() {
    aa.apply(this, arguments);
  }function da() {
    Y.apply(this, arguments), this._timer = null, this._input = null;
  }function ea() {
    aa.apply(this, arguments);
  }function fa() {
    aa.apply(this, arguments);
  }function ga() {
    Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0;
  }function ha(a, b) {
    return b = b || {}, b.recognizers = l(b.recognizers, ha.defaults.preset), new ia(a, b);
  }function ia(a, b) {
    this.options = la({}, ha.defaults, b || {}), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = a, this.input = y(this), this.touchAction = new V(this, this.options.touchAction), ja(this, !0), g(this.options.recognizers, function (a) {
      var b = this.add(new a[0](a[1]));a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3]);
    }, this);
  }function ja(a, b) {
    var c = a.element;if (c.style) {
      var d;g(a.options.cssProps, function (e, f) {
        d = u(c.style, f), b ? (a.oldCssProps[d] = c.style[d], c.style[d] = e) : c.style[d] = a.oldCssProps[d] || "";
      }), b || (a.oldCssProps = {});
    }
  }function ka(a, c) {
    var d = b.createEvent("Event");d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d);
  }var la,
      ma = ["", "webkit", "Moz", "MS", "ms", "o"],
      na = b.createElement("div"),
      oa = "function",
      pa = Math.round,
      qa = Math.abs,
      ra = Date.now;la = "function" != typeof Object.assign ? function (a) {
    if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object");for (var b = Object(a), c = 1; c < arguments.length; c++) {
      var e = arguments[c];if (e !== d && null !== e) for (var f in e) {
        e.hasOwnProperty(f) && (b[f] = e[f]);
      }
    }return b;
  } : Object.assign;var sa = h(function (a, b, c) {
    for (var e = Object.keys(b), f = 0; f < e.length;) {
      (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
    }return a;
  }, "extend", "Use `assign`."),
      ta = h(function (a, b) {
    return sa(a, b, !0);
  }, "merge", "Use `assign`."),
      ua = 1,
      va = /mobile|tablet|ip(ad|hone|od)|android/i,
      wa = "ontouchstart" in a,
      xa = u(a, "PointerEvent") !== d,
      ya = wa && va.test(navigator.userAgent),
      za = "touch",
      Aa = "pen",
      Ba = "mouse",
      Ca = "kinect",
      Da = 25,
      Ea = 1,
      Fa = 2,
      Ga = 4,
      Ha = 8,
      Ia = 1,
      Ja = 2,
      Ka = 4,
      La = 8,
      Ma = 16,
      Na = Ja | Ka,
      Oa = La | Ma,
      Pa = Na | Oa,
      Qa = ["x", "y"],
      Ra = ["clientX", "clientY"];x.prototype = { handler: function handler() {}, init: function init() {
      this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler);
    }, destroy: function destroy() {
      this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler);
    } };var Sa = { mousedown: Ea, mousemove: Fa, mouseup: Ga },
      Ta = "mousedown",
      Ua = "mousemove mouseup";i(L, x, { handler: function handler(a) {
      var b = Sa[a.type];b & Ea && 0 === a.button && (this.pressed = !0), b & Fa && 1 !== a.which && (b = Ga), this.pressed && (b & Ga && (this.pressed = !1), this.callback(this.manager, b, { pointers: [a], changedPointers: [a], pointerType: Ba, srcEvent: a }));
    } });var Va = { pointerdown: Ea, pointermove: Fa, pointerup: Ga, pointercancel: Ha, pointerout: Ha },
      Wa = { 2: za, 3: Aa, 4: Ba, 5: Ca },
      Xa = "pointerdown",
      Ya = "pointermove pointerup pointercancel";a.MSPointerEvent && !a.PointerEvent && (Xa = "MSPointerDown", Ya = "MSPointerMove MSPointerUp MSPointerCancel"), i(M, x, { handler: function handler(a) {
      var b = this.store,
          c = !1,
          d = a.type.toLowerCase().replace("ms", ""),
          e = Va[d],
          f = Wa[a.pointerType] || a.pointerType,
          g = f == za,
          h = r(b, a.pointerId, "pointerId");e & Ea && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ga | Ha) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, { pointers: b, changedPointers: [a], pointerType: f, srcEvent: a }), c && b.splice(h, 1));
    } });var Za = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
      $a = "touchstart",
      _a = "touchstart touchmove touchend touchcancel";i(N, x, { handler: function handler(a) {
      var b = Za[a.type];if (b === Ea && (this.started = !0), this.started) {
        var c = O.call(this, a, b);b & (Ga | Ha) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a });
      }
    } });var ab = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
      bb = "touchstart touchmove touchend touchcancel";i(P, x, { handler: function handler(a) {
      var b = ab[a.type],
          c = Q.call(this, a, b);c && this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a });
    } });var cb = 2500,
      db = 25;i(R, x, { handler: function handler(a, b, c) {
      var d = c.pointerType == za,
          e = c.pointerType == Ba;if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) {
        if (d) S.call(this, b, c);else if (e && U.call(this, c)) return;this.callback(a, b, c);
      }
    }, destroy: function destroy() {
      this.touch.destroy(), this.mouse.destroy();
    } });var eb = u(na.style, "touchAction"),
      fb = eb !== d,
      gb = "compute",
      hb = "auto",
      ib = "manipulation",
      jb = "none",
      kb = "pan-x",
      lb = "pan-y",
      mb = X();V.prototype = { set: function set(a) {
      a == gb && (a = this.compute()), fb && this.manager.element.style && mb[a] && (this.manager.element.style[eb] = a), this.actions = a.toLowerCase().trim();
    }, update: function update() {
      this.set(this.manager.options.touchAction);
    }, compute: function compute() {
      var a = [];return g(this.manager.recognizers, function (b) {
        k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()));
      }), W(a.join(" "));
    }, preventDefaults: function preventDefaults(a) {
      var b = a.srcEvent,
          c = a.offsetDirection;if (this.manager.session.prevented) return void b.preventDefault();var d = this.actions,
          e = p(d, jb) && !mb[jb],
          f = p(d, lb) && !mb[lb],
          g = p(d, kb) && !mb[kb];if (e) {
        var h = 1 === a.pointers.length,
            i = a.distance < 2,
            j = a.deltaTime < 250;if (h && i && j) return;
      }return g && f ? void 0 : e || f && c & Na || g && c & Oa ? this.preventSrc(b) : void 0;
    }, preventSrc: function preventSrc(a) {
      this.manager.session.prevented = !0, a.preventDefault();
    } };var nb = 1,
      ob = 2,
      pb = 4,
      qb = 8,
      rb = qb,
      sb = 16,
      tb = 32;Y.prototype = { defaults: {}, set: function set(a) {
      return la(this.options, a), this.manager && this.manager.touchAction.update(), this;
    }, recognizeWith: function recognizeWith(a) {
      if (f(a, "recognizeWith", this)) return this;var b = this.simultaneous;return a = _(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this;
    }, dropRecognizeWith: function dropRecognizeWith(a) {
      return f(a, "dropRecognizeWith", this) ? this : (a = _(a, this), delete this.simultaneous[a.id], this);
    }, requireFailure: function requireFailure(a) {
      if (f(a, "requireFailure", this)) return this;var b = this.requireFail;return a = _(a, this), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this;
    }, dropRequireFailure: function dropRequireFailure(a) {
      if (f(a, "dropRequireFailure", this)) return this;a = _(a, this);var b = r(this.requireFail, a);return b > -1 && this.requireFail.splice(b, 1), this;
    }, hasRequireFailures: function hasRequireFailures() {
      return this.requireFail.length > 0;
    }, canRecognizeWith: function canRecognizeWith(a) {
      return !!this.simultaneous[a.id];
    }, emit: function emit(a) {
      function b(b) {
        c.manager.emit(b, a);
      }var c = this,
          d = this.state;qb > d && b(c.options.event + Z(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= qb && b(c.options.event + Z(d));
    }, tryEmit: function tryEmit(a) {
      return this.canEmit() ? this.emit(a) : void (this.state = tb);
    }, canEmit: function canEmit() {
      for (var a = 0; a < this.requireFail.length;) {
        if (!(this.requireFail[a].state & (tb | nb))) return !1;a++;
      }return !0;
    }, recognize: function recognize(a) {
      var b = la({}, a);return k(this.options.enable, [this, b]) ? (this.state & (rb | sb | tb) && (this.state = nb), this.state = this.process(b), void (this.state & (ob | pb | qb | sb) && this.tryEmit(b))) : (this.reset(), void (this.state = tb));
    }, process: function process(a) {}, getTouchAction: function getTouchAction() {}, reset: function reset() {} }, i(aa, Y, { defaults: { pointers: 1 }, attrTest: function attrTest(a) {
      var b = this.options.pointers;return 0 === b || a.pointers.length === b;
    }, process: function process(a) {
      var b = this.state,
          c = a.eventType,
          d = b & (ob | pb),
          e = this.attrTest(a);return d && (c & Ha || !e) ? b | sb : d || e ? c & Ga ? b | qb : b & ob ? b | pb : ob : tb;
    } }), i(ba, aa, { defaults: { event: "pan", threshold: 10, pointers: 1, direction: Pa }, getTouchAction: function getTouchAction() {
      var a = this.options.direction,
          b = [];return a & Na && b.push(lb), a & Oa && b.push(kb), b;
    }, directionTest: function directionTest(a) {
      var b = this.options,
          c = !0,
          d = a.distance,
          e = a.direction,
          f = a.deltaX,
          g = a.deltaY;return e & b.direction || (b.direction & Na ? (e = 0 === f ? Ia : 0 > f ? Ja : Ka, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Ia : 0 > g ? La : Ma, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction;
    }, attrTest: function attrTest(a) {
      return aa.prototype.attrTest.call(this, a) && (this.state & ob || !(this.state & ob) && this.directionTest(a));
    }, emit: function emit(a) {
      this.pX = a.deltaX, this.pY = a.deltaY;var b = $(a.direction);b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a);
    } }), i(ca, aa, { defaults: { event: "pinch", threshold: 0, pointers: 2 }, getTouchAction: function getTouchAction() {
      return [jb];
    }, attrTest: function attrTest(a) {
      return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ob);
    }, emit: function emit(a) {
      if (1 !== a.scale) {
        var b = a.scale < 1 ? "in" : "out";a.additionalEvent = this.options.event + b;
      }this._super.emit.call(this, a);
    } }), i(da, Y, { defaults: { event: "press", pointers: 1, time: 251, threshold: 9 }, getTouchAction: function getTouchAction() {
      return [hb];
    }, process: function process(a) {
      var b = this.options,
          c = a.pointers.length === b.pointers,
          d = a.distance < b.threshold,
          f = a.deltaTime > b.time;if (this._input = a, !d || !c || a.eventType & (Ga | Ha) && !f) this.reset();else if (a.eventType & Ea) this.reset(), this._timer = e(function () {
        this.state = rb, this.tryEmit();
      }, b.time, this);else if (a.eventType & Ga) return rb;return tb;
    }, reset: function reset() {
      clearTimeout(this._timer);
    }, emit: function emit(a) {
      this.state === rb && (a && a.eventType & Ga ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = ra(), this.manager.emit(this.options.event, this._input)));
    } }), i(ea, aa, { defaults: { event: "rotate", threshold: 0, pointers: 2 }, getTouchAction: function getTouchAction() {
      return [jb];
    }, attrTest: function attrTest(a) {
      return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ob);
    } }), i(fa, aa, { defaults: { event: "swipe", threshold: 10, velocity: .3, direction: Na | Oa, pointers: 1 }, getTouchAction: function getTouchAction() {
      return ba.prototype.getTouchAction.call(this);
    }, attrTest: function attrTest(a) {
      var b,
          c = this.options.direction;return c & (Na | Oa) ? b = a.overallVelocity : c & Na ? b = a.overallVelocityX : c & Oa && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && qa(b) > this.options.velocity && a.eventType & Ga;
    }, emit: function emit(a) {
      var b = $(a.offsetDirection);b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a);
    } }), i(ga, Y, { defaults: { event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 9, posThreshold: 10 }, getTouchAction: function getTouchAction() {
      return [ib];
    }, process: function process(a) {
      var b = this.options,
          c = a.pointers.length === b.pointers,
          d = a.distance < b.threshold,
          f = a.deltaTime < b.time;if (this.reset(), a.eventType & Ea && 0 === this.count) return this.failTimeout();if (d && f && c) {
        if (a.eventType != Ga) return this.failTimeout();var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
            h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;var i = this.count % b.taps;if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function () {
          this.state = rb, this.tryEmit();
        }, b.interval, this), ob) : rb;
      }return tb;
    }, failTimeout: function failTimeout() {
      return this._timer = e(function () {
        this.state = tb;
      }, this.options.interval, this), tb;
    }, reset: function reset() {
      clearTimeout(this._timer);
    }, emit: function emit() {
      this.state == rb && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input));
    } }), ha.VERSION = "2.0.8", ha.defaults = { domEvents: !1, touchAction: gb, enable: !0, inputTarget: null, inputClass: null, preset: [[ea, { enable: !1 }], [ca, { enable: !1 }, ["rotate"]], [fa, { direction: Na }], [ba, { direction: Na }, ["swipe"]], [ga], [ga, { event: "doubletap", taps: 2 }, ["tap"]], [da]], cssProps: { userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)" } };var ub = 1,
      vb = 2;ia.prototype = { set: function set(a) {
      return la(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this;
    }, stop: function stop(a) {
      this.session.stopped = a ? vb : ub;
    }, recognize: function recognize(a) {
      var b = this.session;if (!b.stopped) {
        this.touchAction.preventDefaults(a);var c,
            d = this.recognizers,
            e = b.curRecognizer;(!e || e && e.state & rb) && (e = b.curRecognizer = null);for (var f = 0; f < d.length;) {
          c = d[f], b.stopped === vb || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (ob | pb | qb) && (e = b.curRecognizer = c), f++;
        }
      }
    }, get: function get(a) {
      if (a instanceof Y) return a;for (var b = this.recognizers, c = 0; c < b.length; c++) {
        if (b[c].options.event == a) return b[c];
      }return null;
    }, add: function add(a) {
      if (f(a, "add", this)) return this;var b = this.get(a.options.event);return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a;
    }, remove: function remove(a) {
      if (f(a, "remove", this)) return this;if (a = this.get(a)) {
        var b = this.recognizers,
            c = r(b, a);-1 !== c && (b.splice(c, 1), this.touchAction.update());
      }return this;
    }, on: function on(a, b) {
      if (a !== d && b !== d) {
        var c = this.handlers;return g(q(a), function (a) {
          c[a] = c[a] || [], c[a].push(b);
        }), this;
      }
    }, off: function off(a, b) {
      if (a !== d) {
        var c = this.handlers;return g(q(a), function (a) {
          b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a];
        }), this;
      }
    }, emit: function emit(a, b) {
      this.options.domEvents && ka(a, b);var c = this.handlers[a] && this.handlers[a].slice();if (c && c.length) {
        b.type = a, b.preventDefault = function () {
          b.srcEvent.preventDefault();
        };for (var d = 0; d < c.length;) {
          c[d](b), d++;
        }
      }
    }, destroy: function destroy() {
      this.element && ja(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null;
    } }, la(ha, { INPUT_START: Ea, INPUT_MOVE: Fa, INPUT_END: Ga, INPUT_CANCEL: Ha, STATE_POSSIBLE: nb, STATE_BEGAN: ob, STATE_CHANGED: pb, STATE_ENDED: qb, STATE_RECOGNIZED: rb, STATE_CANCELLED: sb, STATE_FAILED: tb, DIRECTION_NONE: Ia, DIRECTION_LEFT: Ja, DIRECTION_RIGHT: Ka, DIRECTION_UP: La, DIRECTION_DOWN: Ma, DIRECTION_HORIZONTAL: Na, DIRECTION_VERTICAL: Oa, DIRECTION_ALL: Pa, Manager: ia, Input: x, TouchAction: V, TouchInput: P, MouseInput: L, PointerEventInput: M, TouchMouseInput: R, SingleTouchInput: N, Recognizer: Y, AttrRecognizer: aa, Tap: ga, Pan: ba, Swipe: fa, Pinch: ca, Rotate: ea, Press: da, on: m, off: n, each: g, merge: ta, extend: sa, assign: la, inherit: i, bindFn: j, prefixed: u });var wb = "undefined" != typeof a ? a : "undefined" != typeof self ? self : {};wb.Hammer = ha, "function" == typeof define && define.amd ? define(function () {
    return ha;
  }) : "undefined" != typeof module && module.exports ? module.exports = ha : a[c] = ha;
}(window, document, "Hammer");
//# sourceMappingURL=hammer.min.js.map