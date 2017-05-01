let allTags;

class Search {
    constructor() {
        allTags = Search.getTags();
        //Search.showTags(allTags);
        Search.showExcersices();
    }

    static getTags() {
        let tagsElements = xml.querySelectorAll('[data-tags]'),
            tagsString = '',
            tags = [];
        
        tagsElements.forEach(function(el) {
            tagsString += el.dataset.tags + ' ';
        });
        tagsString = tagsString.split(' ');

        tagsString.forEach(function(el) {
            let isDouble = false;

            tags.forEach(function(el2){
                if(el === el2) {
                    isDouble = true;
                }
            });

            if(!isDouble) {
                tags.push(el);
            }
        });

        return tags;
    }

    static showTags(tagElements) {
        let tagsHolder = document.querySelector('.search_tags');
        tagElements.forEach(function(el){
            tagsHolder.appendChild(el);
        });
    }

    static showExcersices() {
        let excercisesHolder = document.querySelector('.search_excercises');
    }
}