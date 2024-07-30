let requestedserver = false;
function timeHop() {
    loading.startanimation();
    reqTimehopFromServer();
}
function reqTimehopFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let rand_date = JSON.parse(xhttp.response);
            rdate.setRandomDate(new Date(rand_date.date), rand_date.info);
            loading.stopanimation();
            updatedate(rdate.date.getFullYear(), rdate.date.getMonth(), rdate.date.getDate());
            showeventpopup("infobyai");
            rdate.isready = false;
        }
    };
    xhttp.open("GET", "/reqtimehop", true);
    xhttp.send();
}