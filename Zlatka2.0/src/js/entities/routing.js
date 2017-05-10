class Routing {
    static setPage(title, url, meta) {
        if (utils.isSet(meta)) {
            document.title = meta.title;
            document.querySelector('meta[name="description"]').content = meta.descr;
            document.querySelector('meta[name="keywords"]').content = meta.keywords;
        } else if (url === '/') {
            document.title = 'Muscules.by - ваш персональный тренер';
            document.querySelector('meta[name="description"]').content = 'Ваш персональный тренер';
            document.querySelector('meta[name="keywords"]').content = 'тренировки, бодибилдинг, упражнения, мышцы';
        }
        history.replaceState({}, title, window.location.protocol + '//' + window.location.host + url);
    }

    static loadPage(url) {
        let path = url.substring(1).split('/');

        if (path[0] === 'excercise') {
            UI.showInfo(null, path[1]);
        }
    }
}