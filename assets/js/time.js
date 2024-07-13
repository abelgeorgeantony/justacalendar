class randomdate {
    constructor() {
        this.date = new Date();
        this.info = "NO VALUES WERE GIVEN FROM SERVER!"
        this.isready = false;
    }
    setRandomDate(datefromgemini, infobygemini) {
        this.date = datefromgemini;
        this.info = infobygemini;
        this.isready = true;
    }
}
const rdate = new randomdate();


function weekscount(dateobj) {
    let month = dateobj.getMonth();
    let firstday = new Date(dateobj.getFullYear(), dateobj.getMonth(), 1).getDay();
    if (month === 1) { //february
        if (isLeap(dateobj.getFullYear())) {
            return 5;
        }
        else {
            if (firstday === 0) {
                return 4;
            }
            else {
                return 5;
            }
        }
    }
    else if (month === 3 || month === 5 || month === 8 || month === 10) {
        if (firstday === 6) {
            return 6;
        }
        else {
            return 5;
        }
    }
    else {
        if (firstday >= 0 && firstday <= 4) {
            return 5;
        }
        else {
            return 6;
        }
    }
}
function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}