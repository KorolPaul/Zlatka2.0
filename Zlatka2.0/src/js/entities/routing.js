class Routing {
    static setPage(title, url, meta) {
        document.title = meta.title;
        document.querySelector('meta[name="description"]').content = meta.descr;
        document.querySelector('meta[name="keywords"]').content = meta.keywords;

        history.replaceState({}, title, url);
    }

    static loadPage(url) {
        let path = url.substring(1).split('/');

        if (path[0] === 'excercise') {
            UI.showInfo(null, path[1]);
        }
    }
}