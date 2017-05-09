            
class Excercise {
    constructor(e, excercise, excerciseInfo) {
        Excercise.add(utils.index(e), excercise, excerciseInfo);
        trainingsPopup.classList.remove('trainings-popup__visible');
    }

    static add(trainingIndex, excercise, excerciseInfo) {
        let newExcerciseItem = utils.createElement('li', 'training_item', null),
            name = utils.createElement('span', 'training_excercise', excercise.innerHTML),    
            sets = utils.createElement('ul', 'sets', excerciseInfo.innerHTML);

        newExcerciseItem.appendChild(name);
        newExcerciseItem.appendChild(sets);
        newExcerciseItem.dataset.id = 'training' + Math.random() * 10;

        document.querySelector('.trainings_item:nth-child(' + trainingIndex + ') .trainings_excercises').appendChild(newExcerciseItem);
        Training.saveProgram();
    }

    static show(e) {
        excercise.classList.add('excercise__visible');
        excerciseSetsHolder.innerHTML = e.currentTarget.innerHTML;
        
        let excerciseRanges = excerciseSetsHolder.querySelectorAll('input[type="range"]');
        for (let i = 0; i < excerciseRanges.length; i++){
            excerciseRanges[i].addEventListener('input', Excercise.changeValue);
        }
        
        deleteExcercise.dataset.id = e.currentTarget.dataset.id;
        copyExcercise.dataset.id = e.currentTarget.dataset.id;
    }

    static delete() {
        let trainingElements = document.querySelectorAll('.training_item[data-id="' + deleteExcercise.dataset.id + '"]');

        trainingElements.forEach(function (el) {
            el.remove();
        });

        Excercise.close();
        Training.saveProgram();
    }

    static showCopyPopup() {
        let trainingsList = document.querySelectorAll('.trainings_item:not(#trainings-settings)'),
            copyListHolder = document.getElementById('copy-list');    

        copyListHolder.innerHTML = '';

        trainingsList.forEach(function (el) {
            let excercisesCount = el.querySelectorAll('.training_item').length,
                newTraining = utils.createElement('li', 'edit-popup_list-item', el.querySelector('.trainings_name').innerText, null, function () { Excercise.copy(utils.index(el)) })    
            
            newTraining.appendChild(utils.createElement('p', 'edit-popup_count', excercisesCount + ' упражнений'));
            copyListHolder.appendChild(newTraining)
        });
        copyPopup.classList.add('edit-popup__opened');
    }

    static hideCopyPopup(e) {
        if (e) {
            e.preventDefault();
        }

        copyPopup.classList.remove('edit-popup__opened');
    }

    static copy(trainingIndex) {
        Excercise.add(trainingIndex, trainingsBlock.querySelector('.training_item[data-id="' + copyExcercise.dataset.id + '"] .training_excercise'), trainingsBlock.querySelector('.training_item[data-id="' + copyExcercise.dataset.id + '"] .sets'));
        
        Excercise.hideCopyPopup();
    }

    static close() {
        excercise.classList.remove('excercise__visible');

        let sets = document.querySelectorAll('.training_item[data-id="' + deleteExcercise.dataset.id + '"] .sets'),
            html = excerciseSetsHolder.querySelector('.sets').innerHTML    ;
        for (let i = 0; i < sets.length; i++) {
            sets[i].innerHTML = html;
        }
        Training.saveProgram();
    }

    static changeValue(e) {
        let input = e.target.name;
        excerciseSetsHolder.querySelector('span[name="'+input+'"]').innerText = e.target.value;
    }
}