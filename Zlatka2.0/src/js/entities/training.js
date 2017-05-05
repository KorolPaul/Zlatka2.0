class Training {
    constructor(name) {
        this.name = name;
    }

    static add() {
        let newTraining = new Training(prompt('Введите название тренировки'));
        newTraining.render();
        Training.saveProgram();
    }

    static addExcercise(e, excercise, excerciseInfo) {
        let excerciseName = utils.createElement('li', 'training_item', null),
            sets = utils.createElement('ul', 'sets', excerciseInfo.innerHTML);

        excerciseName.appendChild(excercise);
        excerciseName.appendChild(sets);

        document.querySelector('.trainings_item:nth-child(' + utils.index(e) + ') .trainings_excercises').appendChild(excerciseName);
        trainingsPopup.classList.remove('trainings-popup__visible');

        Training.saveProgram();
    } 

    static showExcercises(e) {
        training.innerHTML = document.querySelector('.trainings_item:nth-of-type(' + utils.index(e.target.parentNode) + ') .trainings_excercises').innerHTML;

        let trainingItems = document.querySelectorAll('.training .training_item, .training .button');        
        trainingItems.forEach(function (el) {
            if (el.dataset.handler) {
                el.addEventListener('click', eval(el.dataset.handler));
            } else {
                el.addEventListener('click', Excercise.show);
            }
        });
    }

    static saveProgram() {
        fetch('/Training/SaveTraining', {
            body: JSON.stringify({ content: trainingsBlock.innerHTML.replace(/</g, '&lt;') }),
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            console.log(body)
        })
        .catch(function () {
            console.log('Cant save data');
        });
        

        localStorage.trainingProgram = trainingsBlock.innerHTML;
    }

    static loadProgram() {
        if (localStorage.trainingProgram !== undefined) {
            trainingsBlock.innerHTML = localStorage.trainingProgram;

            addHandlers();
        } else {
            fetch('/Training/LoadTraining', {
                method: 'POST',
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
                credentials: 'same-origin'
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                let html = data.replace(/(\\u0026lt;)/g, '<');
                html = html.replace(/(\\")/g, '"');
                html = html.replace(/(\\n)/g, '');
                html = html.replace(/(\\u003e)/g, '>');

                if (html != "") {
                    trainingsBlock.innerHTML = html.substring(1, html.length - 1);
                }
                addHandlers();
            })
            .catch(function (error) {
                console.log(error);
            });
        }

        function addHandlers() {
            let elements = document.querySelectorAll('#trainings *');

            for (let i = 0; i < elements.length; i++) {
                if (elements[i].dataset.handler) {
                    elements[i].addEventListener('click', eval(elements[i].dataset.handler));
                }
            }
        }
    }

    static showPopup() {
        sheduleElement.classList.add('shedule__opened');
    }

    static hidePopup() {
        sheduleElement.classList.remove('shedule__opened');
    }

    static showEditPopup() {
        let trainingsList = document.querySelectorAll('.trainings_item:not(#trainings-settings)'),
            editListHolder = document.getElementById('edit-list');    

        editListHolder.innerHTML = '';

        trainingsList.forEach(function (el) {
            let excercisesCount = el.querySelectorAll('.training_item').length,
                newTraining = utils.createElement('li', 'edit-popup_list-item', el.querySelector('.trainings_name').innerText, null, function () { Excercise.copy(utils.index(el)) })    
            
            newTraining.appendChild(utils.createElement('p', 'edit-popup_count', excercisesCount + ' упражнений'));
            editListHolder.appendChild(newTraining)
        });
        editPopup.classList.add('edit-popup__opened');
    }

    static hideEditPopup(e) {
        if (e) {
            e.preventDefault();
        }

        editPopup.classList.remove('edit-popup__opened');
    }

    static edit(trainingIndex) {
        Excercise.add(trainingIndex, trainingsBlock.querySelector('.training_item[data-id="' + copyExcercise.dataset.id + '"] .training_excercise'), trainingsBlock.querySelector('.training_item[data-id="' + copyExcercise.dataset.id + '"] .sets'));
        
        Training.hideEditPopup();
    }

    render() {
        let newTraining = utils.createElement('li', 'trainings_item'),
            trainingLink = utils.createElement('a', 'trainings_name', this.name, "#", Training.showExcercises),
            trainingContent = utils.createElement('ul', 'trainings_excercises');

        //newTraining.classList.add('droppable');
        //newTraining.classList.add('new');
        
        newTraining.appendChild(trainingLink);
        newTraining.appendChild(trainingContent);

        document.querySelector(".trainings").insertBefore(newTraining, document.querySelector('#trainings-settings'));
        //trainings.push(newTraining);

        let elements = document.querySelectorAll('#trainings *');

        for (let i = 0; i < elements.length; i++) {
            if (typeof elements[i].onclick == "function") {
                elements[i].dataset.handler = 'Training.' + elements[i].onclick.name;
            }
        }
    }
}