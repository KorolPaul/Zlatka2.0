class Routing {
    static setPage(title, url) {
        history.replaceState({}, title, url);
    }

    static loadPage(url) {
        let path = url.substring(1).split('/');

        if (path[0] === 'excercise') {
            UI.showInfo()
        }
    }
}