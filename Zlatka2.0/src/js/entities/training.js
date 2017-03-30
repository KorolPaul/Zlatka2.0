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
        training.innerHTML = document.querySelector('.trainings_item:nth-child(' + utils.index(e.target.parentNode) + ') .trainings_excercises').innerHTML;
        
        let trainingItems = document.querySelectorAll('.training .training_item');
        for (let i = 0; i < trainingItems.length; i++){
            trainingItems[i].addEventListener('click', Excercise.show);
        }
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

    render() {
        let newTraining = utils.createElement('li', 'trainings_item'),
            trainingLink = utils.createElement('a', 'trainings_name', this.name, "#", Training.showExcercises),
            trainingContent = utils.createElement('ul', 'trainings_excercises');

        //newTraining.classList.add('droppable');
        //newTraining.classList.add('new');
        
        newTraining.appendChild(trainingLink);
        newTraining.appendChild(trainingContent);

        document.querySelector(".trainings").appendChild(newTraining);
        //trainings.push(newTraining);

        let elements = document.querySelectorAll('#trainings *');

        for (let i = 0; i < elements.length; i++) {
            if (typeof elements[i].onclick == "function") {
                elements[i].dataset.handler = 'Training.' + elements[i].onclick.name;
            }
        }
    }
}