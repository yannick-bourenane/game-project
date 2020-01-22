const contentMain = document.getElementById("ajaxbox");

(function () {
    axios
        .get(`/intro.html`)
        .then(res => {
            contentMain.innerHTML = res.data;
            document
                .querySelectorAll("#ajaxbox .link")
                .forEach(link => (link.onclick = loadPage));
        })
        .catch(err => {
            console.error(err);
        });

})();

function loadPage(e) {
    let loadGame = false;
    const page = e.target.getAttribute("data-page");
    console.log(page)
    axios
        .get(`/${page}.html`)
        .then(res => {
            contentMain.innerHTML = res.data;

            document
                .querySelectorAll("#ajaxbox .link")
                .forEach(link => {
                    link.onclick = loadPage;
                });
        })
        .catch(err => {
            console.error(err);
        });
    if (page === `game`) {
        loadGame = true;
        return loadGame;
    }
}