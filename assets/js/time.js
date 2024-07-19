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
const days = [
    new label("Sunday"),
    new label("Monday"),
    new label("Tuesday"),
    new label("Wednesday"),
    new label("Thursday"),
    new label("Friday"),
    new label("Saturday")
];
const months = [
    new label("January"),
    new label("February"),
    new label("March"),
    new label("April"),
    new label("May"),
    new label("June"),
    new label("July"),
    new label("August"),
    new label("September"),
    new label("October"),
    new label("November"),
    new label("December")
];


const rdate = new randomdate();


let curr_date;
let curr_time;
function findandsetcurrdate_time() {
    if (new Date().getMonth() < 9) {
        if (new Date().getDate() < 10) {
            curr_date = new Date().getFullYear() + "-0" + (new Date().getMonth() + 1) + "-0" + new Date().getDate();
        }
        else {
            curr_date = new Date().getFullYear() + "-0" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
        }
    }
    else {
        if (new Date().getDate() < 10) {
            curr_date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-0" + new Date().getDate();
        }
        else {
            curr_date = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
        }

    }
    if (new Date().getHours() < 10) {
        if (new Date().getMinutes() < 10) {
            curr_time = ("0" + new Date().getHours() + ":0" + new Date().getMinutes());
        }
        else {
            curr_time = ("0" + new Date().getHours() + ":" + new Date().getMinutes());
        }
    }
    else {
        if (new Date().getMinutes() < 10) {
            curr_time = (new Date().getHours() + ":0" + new Date().getMinutes());
        }
        else {
            curr_time = (new Date().getHours() + ":" + new Date().getMinutes());
        }
    }
}


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



function findAmPm(hour) {
    if (Number(hour) < 12) {
        return "am";
    }
    return "pm";
}
function formatDate(d, m, y) {
    let resultdate;
    if (Number(d) < 10) {
        resultdate = "0" + d;
    }
    else {
        resultdate = d;
    }
    if (Number(m) < 10) {
        resultdate = resultdate + "/0" + m;
    }
    else {
        resultdate = resultdate + "/" + m;
    }
    resultdate = resultdate + "/" + y;
    return resultdate;
}
function formatTime(h, m, outputstyle) {
    let resulttime;
    if ((Number(h) > 12) && (Number(outputstyle) === 12)) {
        h = Number(h) - 12;
    }
    if (Number(h) < 10) {
        resulttime = "0" + h;
    }
    else {
        resulttime = h;
    }
    if (Number(m) < 10) {
        resulttime = resulttime + ":0" + m;
    }
    else {
        resulttime = resulttime + ":" + m;
    }
    return resulttime;
}
function deformatTime(timestr) {
    let hourandminute = timestr.split(":");
    if (hourandminute[1].split(" ")[1] === "pm") {
        hourandminute[0] = Number(hourandminute[0]) + 12
    }
    else {
        hourandminute[0] = Number(hourandminute[0]);
    }
    hourandminute[1] = Number(hourandminute[1].split(" ")[0]);
    return hourandminute;
}