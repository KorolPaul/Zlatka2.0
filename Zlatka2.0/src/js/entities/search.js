let allTags,
    searchElement = document.getElementById('search');

class Search {
    constructor() {
        allTags = Search.getTags();
        Search.showTags(allTags);

        Search.showExcersices(this, 'li[id]');

        document.querySelector('.search_input').addEventListener('input', Search.sortExcersises);
    }

    static getTags() {
        let tagsElements = xml.querySelectorAll('[data-tags]'),
            tagsString = '',
            tags = [];
        
        tagsElements.forEach(function(el) {
            tagsString += el.dataset.tags + ', ';
        });
        tagsString = tagsString.split(', ');

        tagsString.forEach(function(el) {
            let isDouble = false;

            tags.forEach(function(el2){
                if(el === el2) {
                    isDouble = true;
                }
            });

            if(!isDouble && el) {
                tags.push(el);
            }
        });

        return tags;
    }

    static showTags(tagElements) {
        let tagsHolder = document.querySelector('.search_tags');
        tagElements.forEach(function (el) {
            let newTag = utils.createElement('a', 'tag', el, {href: '#', onclick: Search.showExcersices })
            tagsHolder.appendChild(newTag);
        });
    }

    static showExcersices(e, selector, textQuery) {
        let excercisesHolder = document.querySelector('.search_excercises'),
            excercisesList;
        
        if (selector) {
            excercisesList = xml.querySelectorAll(selector);
        } else {
            e.preventDefault();            
            excercisesList = xml.querySelectorAll('.' + this.innerHTML + ', [data-tags*="' + this.innerHTML + '"    ]')
        }
        
        excercisesHolder.innerHTML = '';
        excercisesList.forEach(function (el) {
            let excerciseName = el.querySelector('.excercise-name').innerHTML;
            if (! textQuery || excerciseName.indexOf(textQuery) != -1) {
                let excercise = utils.createElement('li', 'excercise-name', excerciseName, {onclick: UI.showInfo});
                excercise.dataset['complexity'] = el.getAttribute('data-complexity');
                excercise.dataset['excersice'] = el.id;

                excercisesHolder.appendChild(excercise);
            } else {
                excercisesHolder.innerHTML = '<h3>Ничего не найдено</h3>';
            }
            
        });
    }

    static sortExcersises(e) {
        Search.showExcersices(null, 'li[id]', e.target.value)
    }
    
    static showPopup() {
        searchElement.classList.add('search__opened');
    }

    static hidePopup() {
        searchElement.classList.remove('search__opened');
    }
}