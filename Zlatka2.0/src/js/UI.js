
let trainings = [],
    xml = document.createElement('div'),
    isTouchDevice = 'ontouchstart' in document.documentElement;
;

let info,
    infoClose,
    training,
    trainingsBlock,
    trainingsPopup,
    addTrainingButton,
    droppable,
    shedule,
    muscules,
    musculesSides,
    musculesList,
    musculeTitles,
    sheduleToggle,
    excercise,
    excercises,
    excerciseSetsHolder,
    closeExcercise,
    deleteExcercise,
    avatar;

const UI = {

    showInfo: function(e) {
        let html = xml.getElementsByClassName(this.dataset['name'])[this.dataset['origin']].innerHTML;
        info.classList.add('opened');

        info.querySelector('.info_holder').innerHTML = html;
        info.querySelector('.add-button').addEventListener('click', function () { 
            kach.selectTraining(info);
        });

        let galleryItems = info.querySelectorAll('.info_gallery-item');
        for (let i = 0; i < galleryItems.length; i++) {
            galleryItems[i].addEventListener('click', function () {
                for (let j = 0; j < galleryItems.length; j++) {
                    galleryItems[j].classList.remove('info_gallery-item__active');
                }

                galleryItems[i].classList.add('info_gallery-item__active');
                galleryItems[i].children[0].click();
            })
        }

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
        })
        .catch(function (error) {
            console.log('Cant load xml');
            console.log(error);
        });
        
    },

    showExcercises: function (e) {
        var musculeName = this.dataset.muscle || this.className['baseVal'] || this.className,
            html = xml.getElementsByClassName(musculeName);

        excercises.innerHTML = '';
        console.log(musculeName)
        for (var i = 0; i < html.length; i++) {
            var excercise = utils.createElement('li', 'excercise-name', html[i].querySelector('.excercise-name').innerHTML, null, UI.showInfo);
            excercise.dataset['complexity'] = html[i].getAttribute('data-complexity');
            excercise.dataset['origin'] = i;
            excercise.dataset['name'] = musculeName;

            //excercise.addEventListener('mousedown', touch.moveExcerciseStart);
            //excercise.addEventListener('touchstart', touch.moveExcerciseStart);

            excercises.appendChild(excercise);
        }
    },

    loadAvatar: function () {
        if (localStorage.avatarUrl !== undefined) {
            avatar.src = localStorage.avatarUrl;
        } else {
            fetch('/Training/GetAvatar', {
                method: 'POST',
                headers: { 'Content-Type': 'text; charset=utf-8' }
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (data) {
                let src = data.replace(/\"/g, "");
                src = src.replace(/sz=50/, 'sz=100');
                avatar.src = src;
                localStorage.avatarUrl = src;
            })
            .catch(function (error) {
                console.log(error);
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