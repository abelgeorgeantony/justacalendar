class myname {
    constructor(fulln) {
        this.fullname = fulln;
        this.shortname = this.reducename(3);
    }
    reducename(length) {
        if (length === (this.fullname.length - 1)) {
            return this.fullname;;
        }
        else if (length === this.fullname.length || length > this.fullname.length || length === 0) {
            console.log("Trying to shorten name failed! Invalid length given to shorten");
        }
        let reduced = "";
        for (let i = 0; i < length; i++) {
            reduced = reduced + this.fullname[i];
        }
        return reduced;
    }
}
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
class loadingscreen {
    startanimation() {
        const screen = document.getElementById('loadingcontainer');
        screen.style.zIndex = "9999";
        this.animationloopid = setInterval(this.loadingTextAnimation,400);
        this.userwasviewing = displayed_date;
        this.dateHoppingAnimationID = setInterval(this.startDateHopping,330);
        this.animationrunning = true;
    }
    startDateHopping() {
        if(displayed_date.getFullYear() > 1830) {
            if(displayed_date.getMonth() > 3 ) {
                if(displayed_date.getDate() > 7 ) {
                    updatedate((displayed_date.getFullYear()-61),(displayed_date.getMonth()-2),displayed_date.getDate()-6);
                }
                else {
                    updatedate((displayed_date.getFullYear()-52),(displayed_date.getMonth()-2),displayed_date.getDate()+20);
                }
            }
            else {
                if(displayed_date.getDate() > 7 ) {
                    updatedate((displayed_date.getFullYear()-61),(displayed_date.getMonth()+7),displayed_date.getDate()-6);
                }
                else {
                    updatedate((displayed_date.getFullYear()-52),(displayed_date.getMonth()+7),displayed_date.getDate()+20);
                }
            }
        }
        else {
            if(displayed_date.getMonth() > 3 ) {
                if(displayed_date.getDate() > 7 ) {
                    updatedate((displayed_date.getFullYear()+181),(displayed_date.getMonth()-2),displayed_date.getDate()-6);
                }
                else {
                    updatedate((displayed_date.getFullYear()+183),(displayed_date.getMonth()-2),displayed_date.getDate()+20);
                }
            }
            else {
                if(displayed_date.getDate() > 7 ) {
                    updatedate((displayed_date.getFullYear()+181),(displayed_date.getMonth()+7),displayed_date.getDate()-6);
                }
                else {
                    updatedate((displayed_date.getFullYear()+183),(displayed_date.getMonth()+7),displayed_date.getDate()+20);
                }
            }
        }
    }
    stopDateHopping() {
        clearInterval(this.dateHoppingAnimationID);
        updatedate(this.userwasviewing.getFullYear(),this.userwasviewing.getMonth(),this.userwasviewing.getDate());
    }
    stopanimation() {
        this.stopDateHopping();
        clearInterval(this.animationloopid);
        this.animationrunning = false;
        const screen = document.getElementById('loadingcontainer');
        screen.style.zIndex = "-9";
        document.getElementById('loadingtext').innerText = ">";
    }
    loadingTextAnimation() {
        const loadingtext = document.getElementById('loadingtext');
        if (loadingtext.innerText.length !== 5) {
            loadingtext.innerText = loadingtext.innerText + ">";
        }
        else {
            loadingtext.innerText = ">";
        }
    }
}


const loading = new loadingscreen();
let rdate = new randomdate();
const days = [
    new myname("Sunday"),
    new myname("Monday"),
    new myname("Tuesday"),
    new myname("Wednesday"),
    new myname("Thursday"),
    new myname("Friday"),
    new myname("Saturday")
];
const months = [
    new myname("January"),
    new myname("February"),
    new myname("March"),
    new myname("April"),
    new myname("May"),
    new myname("June"),
    new myname("July"),
    new myname("August"),
    new myname("September"),
    new myname("October"),
    new myname("November"),
    new myname("December")
];
let displayed_date = new Date();
function getCookie(nametofind) {
    //document.cookie = "cookie3=value1; SameSite=Strict; path=/";
    //document.cookie = "username2test2; expires=Thu, 18 Dec 2023 12:00:00 UTC; path=/";
    const cookies = document.cookie.split('; ');
    console.log(document.cookie);
    //const cookieMap = {};
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        //cookieMap[name] = value;
        console.log("Name:" + name + " Value:" + value);
        if (nametofind === name) {
            return value;
        }
    });
}
function isSignedIn() {
    if (getCookie("authorised") === "true") {
        return true;
    }
    //return false;
    return true;
}


function loadTable() {
    if (isSignedIn() === true) {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "4.5vw");
        const currentdate = new Date();
        generateTableHeadings();
        fillCalendar(currentdate);
        addsidebarcontent();
    }
    else {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "2.5vw");
        generateWelcomeCalendar();
    }
}
function goToDate() {
    const inputfields = document.getElementById("datepicker").querySelectorAll("input");
    let monthind;
    for (const [index, month] of months.entries()) {
        if (month.fullname === inputfields[1].value) {
            monthind = index;
        }
    }
    let year = inputfields[2].value;
    let date = inputfields[0].value;
    updatedate(year, monthind, date);
}
function updatedate(year, monthindex, date) {
    let good_date = false;
    if (monthindex === 1) { //february
        if (isLeap(year) === true) {
            if (date >= 1 && date <= 29) {
                good_date = true;
            }
            else {
                good_date = false;
            }
        }
        else if (isLeap(year) === false) {
            if (date >= 1 && date <= 28) {
                good_date = true;
            }
            else {
                good_date = false;
            }
        }
        else {
            good_date = false;
        }
    }
    else if (monthindex === 3 || monthindex === 5 || monthindex === 8 || monthindex === 10) {
        if (date >= 1 && date <= 30) {
            good_date = true;
        }
        else {
            good_date = false;
        }
    }
    else if (monthindex === 0 || monthindex === 2 || monthindex === 4 || monthindex === 6 || monthindex === 7 || monthindex === 9 || monthindex === 11) {
        if (date >= 1 && date <= 31) {
            good_date = true;
        }
        else {
            good_date = false;
        }
    }
    else {
        good_date = false;
    }
    if (good_date === true) {
        console.log("good_date: " + good_date);
        let newdate = new Date(year, monthindex, date);
        fillCalendar(newdate);
        addsidebarcontent();
    }
    else {
        console.log("good_date: " + good_date);
    }
}
function generateTableHeadings() {
    const table = document.getElementById('calendar');
    deletetable();
    table.innerHTML = "";
    let tr = document.createElement('tr'); // Create table header row
    for (const day of days) {
        const th = document.createElement('th');
        th.innerHTML = "";
        th.textContent = day.shortname;
        tr.appendChild(th);
    }
    table.appendChild(tr); // Add header row to table

    /*for (let week = 0; week < weeks; week++) {
        addalastrow();
    }*/
}

function generateWelcomeCalendar() {
    const table = document.getElementById('calendar');
    generateTableHeadings();

    const innhtml = [
        "<a href=\"/home\">Home</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/about\">Help/<br>Support</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/signup\">Sign Up</a><br><a href=\"/login\">/Log In</a>"
    ];
    const t_headings = table.querySelectorAll('TH');
    for (const [index, t_heading] of t_headings.entries()) {
        if (innhtml[index] != "") {
            t_heading.innerHTML = innhtml[index]; // Adding table heading!
        }
        else {
            t_heading.textContent = "@";
        }
    }

    const msg = [
        "W", "E", "L", "C", "O", "M", "E",
        "", "", "", "TO", "", "", "",
        "J", "U", "S", "T", "A", "C", "A",
        "L", "E", "N", "D", "A", "R", "!"
    ];
    for (let week = 0; week < 4; week++) {
        addalastrow();
    }
    const cells = table.querySelectorAll('TD'); // assigning td and th to cells
    for (const [index, cell] of cells.entries()) {
        if (msg[index] != "") {
            cell.textContent = msg[index]; // Adding a Welcome message!
            if (msg[index] === 'J' || msg[index] === 'U' || msg[index] === 'S' || msg[index] === 'T') {
                cell.style.backgroundColor = "#1DB514";
            }
            else if (index === 18 && msg[index] === 'A') {
                cell.style.backgroundColor = "#8A8A8A";
                cell.style.color = "white";
            }
            else if (index > 18 && index < 27) {
                cell.style.backgroundColor = "#ff0028";
            }
            else {
                cell.style.backgroundColor = "#393CFC";
                cell.style.color = "white";
            }
        }
        else {
            cell.textContent = "";
        }
    }
    //styleCalendar();
}

function deletetable() {
    const table = document.getElementById('calendar');
    const rows = table.querySelectorAll('tr');
    rows.forEach(() => {
        removelastrow();
    });
}
function addalastrow() {
    const table = document.getElementById('calendar');
    const tr = document.createElement('tr'); // Create new table row
    // Add 7 empty cells
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('td');
        cell.textContent = "";
        tr.appendChild(cell);
    }
    table.appendChild(tr); // Add the row to the table
}
function removelastrow() {
    const table = document.getElementById('calendar');
    const rows = table.querySelectorAll('tr');
    if (rows.length > 1) {
        rows[rows.length - 1].parentNode.removeChild(rows[rows.length - 1]);
    }
}


let requestedserver = false;
function timeHop() {
    if (rdate.isready === true) {
        loading.stopanimation();
        updatedate(rdate.date.getFullYear(), rdate.date.getMonth(), rdate.date.getDate());
        rdate.isready = false;
        reqTimehopFromServer();
    }
    else {
        if (requestedserver === false) {
            loading.startanimation();
            reqTimehopFromServer();
            requestedserver = true;
        }
        else if(loading.animationrunning === false) {
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



function addsidebarcontent() {
    const sidebar = document.getElementById('calsidebar');
    sidebar.innerHTML = "";
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    const cellcontent = [displayed_date.getDate(), months[displayed_date.getMonth()].shortname, displayed_date.getFullYear(), "Time<br>Hop"];
    if (css_devicesmall === "false") {
        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            const cell = document.createElement('td');
            if (i != 3) {
                cell.innerHTML = "<a href=\"javascript:showdatepicker();\">" + cellcontent[i] + "</a>";
            }
            else {
                cell.innerHTML = "<a href=\"javascript:timeHop();\">" + cellcontent[i] + "</a>";
            }
            tr.appendChild(cell);
            sidebar.appendChild(tr);
        }
    }
    else {
        const tr = document.createElement('tr');
        for (let i = 0; i < 4; i++) {
            const cell = document.createElement('td');
            if (i != 3) {
                cell.innerHTML = "<a href=\"javascript:showdatepicker();\">" + cellcontent[i] + "</a>";
            }
            else {
                cell.innerHTML = "<a href=\"javascript:timeHop();\">" + cellcontent[i] + "</a>";
            }
            tr.appendChild(cell);
        }
        sidebar.appendChild(tr);
    }
}




function fillCalendar(cdate) {
    deletetable();
    for (let i = 0; i < weekscount(cdate); i++) {
        addalastrow();
    }
    displayed_date = cdate;
    const year = cdate.getFullYear();
    const month = cdate.getMonth();
    const firstday = new Date(year, month, 1).getDay();
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD'); // assigning td to cells
    let datecount = 0;
    //let monthlcount = 0;
    for (const [index, cell] of cells.entries()) {
        //cell.innerHTML = "";
        if (index === (firstday + datecount)) {
            datecount++;
            cell.textContent = datecount;
            cell.onclick = function () { showeventpopup(this); };
            if (datecount === cdate.getDate()) {
                cell.style.backgroundColor = "silver";
            }
        }
        /* If to add anything to the blank cells
        else {
            cell.textContent = months[month].fullname[monthlcount];
            cell.textContent = cell.textContent.toUpperCase();
            if (months[month].fullname[monthlcount + 1] === undefined) {
                monthlcount = 0;
            }
            else {
                monthlcount++;
            }
        }*/
        if (month === 1) { //february
            if (isLeap(year)) {
                if (datecount === 29) {
                    datecount = 0;
                }
            }
            else {
                if (datecount === 28) {
                    datecount = 0;
                }
            }
        }
        else if (month === 3 || month === 5 || month === 8 || month === 10) {
            if (datecount === 30) {
                datecount = 0;
            }
        }
        else {
            if (datecount === 31) {
                datecount = 0;
            }
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
    // A year is a leap year if it is divisible by 4 but not by 100,
    // or if it is divisible by 400.
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
