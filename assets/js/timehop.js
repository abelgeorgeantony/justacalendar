let requestedserver = false;
function timeHop() {
    if (rdate.isready === true) {
        loading.stopanimation();
        updatedate(rdate.date.getFullYear(), rdate.date.getMonth(), rdate.date.getDate());
        showeventpopup(null);
        rdate.isready = false;
        reqTimehopFromServer();
    }
    else {
        if (requestedserver === false) {
            loading.startanimation();
            reqTimehopFromServer();
            requestedserver = true;
        }
        else if (loading.animationrunning === false) {
            loading.startanimation();
        }
        setTimeout(timeHop, 300);
    }
}
function reqTimehopFromServer() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let rand_date = JSON.parse(xhttp.response);
            //rand_date.date = rand_date.date.slice(0, rand_date.date.length - 2);
            rand_date.info = rand_date.info.slice(0, rand_date.info.length - 2);
            console.log(rand_date);
            rdate.setRandomDate(new Date(rand_date.date), rand_date.info);
        }
    };
    xhttp.open("GET", "/reqtimehop", true);
    xhttp.send();
}