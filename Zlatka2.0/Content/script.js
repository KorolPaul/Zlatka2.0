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
            if (utils.isSet(url.pathname)) {
                if (url.pathname.indexOf('excercises') != -1) {
                    UI.showInfo(null, url.pathname.substring(12));
                }
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

            return newTraining;
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
        value: function showExcercises(e, num) {
            var excercisesindex = utils.isSet(num) ? num : utils.index(e.target.parentNode);

            training.innerHTML = document.querySelector('.trainings_item:nth-of-type(' + excercisesindex + ') .trainings_excercises').innerHTML;

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
            if (trainingsBlock.children.length === 1) {
                Training.showExcercises(null, 1);
            }

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

        if (!trainingsList.length) {
            new Promise(function (resolve, reject) {
                var trainingName = Training.add();
                resolve(trainingName);
            }).then(function (result) {
                var li = utils.createElement('li', 'trainings-popup_item', result.name, { onclick: function onclick() {
                        var newExcercise = new Excercise(li, newExcerciseName, newExcerciseInfo);
                    } });
                trainingsPopup.appendChild(li);
            });
        } else {
            var _loop = function _loop(i) {
                var li = utils.createElement('li', 'trainings-popup_item', trainingsList[i].innerText, { onclick: function onclick() {
                        var newExcercise = new Excercise(li, newExcerciseName, newExcerciseInfo);
                    } });
                trainingsPopup.appendChild(li);
            };

            for (var i = 0; i < trainingsList.length; i++) {
                _loop(i);
            }
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
    addTrainingButtons = document.querySelectorAll('.addTraining'),
    changeGenderButtons = document.querySelectorAll('.gender_button'),
    musclesMaps = document.querySelectorAll('.muscles_map');

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

            excerciseLink.href = 'snapshots/excercises/' + html[i].id + '/index.html';
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

        changeGenderButtons.forEach(function (el) {
            el.addEventListener('click', function (e) {
                changeGenderButtons.forEach(function (el) {
                    el.classList.remove('gender_button__active');
                });
                e.target.classList.add('gender_button__active');

                musclesMaps.forEach(function (el) {
                    el.classList.remove('muscles_map__active');
                });
                musclesMaps[utils.index(e.target) - 1].classList.add('muscles_map__active');
            });
        });

        document.querySelector('#shedule-toggle').onclick = function (e) {
            e.preventDefault();
            Training.showPopup();
            Search.hidePopup();
            UI.toggleMenu(e);
        };

        document.querySelector('#excercises-toggle').onclick = function (e) {
            e.preventDefault();
            Training.hidePopup();
            Search.showPopup();
            UI.toggleMenu(e);
        };

        document.querySelector('#body-toggle').onclick = function (e) {
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
        //UI.printStackTrace()


        /* Canvas */
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / 3 / (window.innerHeight * 0.8), 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0xffffff, 1);
        renderer.setSize(window.innerWidth / 3, window.innerHeight * 0.8);
        document.querySelector('.muscles_map__men').appendChild(renderer.domElement);

        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
        scene.add(ambientLight);
        var pointLight = new THREE.PointLight(0xcccccc, 0.8);
        camera.add(pointLight);
        scene.add(camera);

        camera.position.z = 250;
        camera.position.y = 100;

        var loader = new THREE.OBJLoader();
        var mouseX = 0,
            mouseY = 0;

        var model = null;

        loader.load('Content/models/men.obj',
        //'https://threejs.org/examples/obj/male02/male02.obj',
        function (object) {
            model = object;
            scene.add(model);
        }, function (xhr) {
            console.log(xhr.loaded / xhr.total * 100 + '% loaded');
        }, function (error) {
            console.log('An error happened');
        });

        document.addEventListener('mousemove', onDocumentMouseMove, false);

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - window.innerWidth / 2) / 2;
            mouseY = (event.clientY - window.innerHeight / 2) / 2;
        };

        function animate() {
            requestAnimationFrame(animate);

            model.rotation.y = mouseX * .005;
            renderer.render(scene, camera);
        }
        animate();
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