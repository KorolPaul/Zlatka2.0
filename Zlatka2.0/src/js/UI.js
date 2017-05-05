
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
      closeExcercise = document.getElementById('close-excercise'),
      copyPopup = document.getElementById('copy-popup'),
      addTrainingButtons = document.querySelectorAll('.addTraining');


const UI = {

    toggleMenu: function (e) {
        e.preventDefault();

        menuTrigger.classList.toggle('menu_trigger__opened');
        menuPopup.classList.toggle('menu_popup__opened');
    },

    showInfo: function (e) {
        let excerciseNode = xml.querySelector('#' + this.dataset['excersice']),
            html = excerciseNode.innerHTML;
        
        info.classList.add('opened');

        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () { 
            kach.selectTraining(info);
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
            let newTag = utils.createElement('a', 'tag', el, '#', UI.showExcercises)
            tagsNode.appendChild(newTag);
        });

        excercises.classList.remove('excercises__visible');                
        window.instgrm.Embeds.process();
        
    },

    loadExcercises: function () {
        fetch('Content/excercises.xml', {
            method: 'GET',
            headers: { 'Content-Type': 'application/xml' }
        })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
            xml.innerHTML = data;
            new Search();    
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
            var excercise = utils.createElement('li', 'excercise-name', html[i].querySelector('.excercise-name').innerHTML, null, UI.showInfo);
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
        if (localStorage.avatarUrl !== undefined) {
            console.log('avatart is saved')
            avatar.src = localStorage.avatarUrl;
        } else {
            console.log('avatart not saved')

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
    }
}