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
        history.pushState({}, title, window.location.protocol + '//' + window.location.host + url);
        document.querySelector('link[rel="canonical"]').href = window.location.toString();
    }
    
    static loadPage(url) {
        if (utils.isSet(url.pathname)) {
            if (url.pathname.indexOf('excercises') != -1) {
                UI.showInfo(null, url.pathname.substring(12));
            }
        } else if (url === '/') {
            UI.hideInfo();
        }
        document.querySelector('link[rel="canonical"]').href = window.location.toString();
    }
}