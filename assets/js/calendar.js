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
        this.animationloopid = setInterval(this.loadingTextAnimation, 900);
        this.userwasviewing = displayed_date;
        this.dateHoppingAnimationID = setInterval(this.startDateHopping, 330);
        this.animationrunning = true;
    }
    startDateHopping() {
        if (displayed_date.getFullYear() > 1830) {
            if (displayed_date.getMonth() > 3) {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() - 61), (displayed_date.getMonth() - 2), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() - 52), (displayed_date.getMonth() - 2), displayed_date.getDate() + 20);
                }
            }
            else {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() - 61), (displayed_date.getMonth() + 7), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() - 52), (displayed_date.getMonth() + 7), displayed_date.getDate() + 20);
                }
            }
        }
        else {
            if (displayed_date.getMonth() > 3) {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() + 181), (displayed_date.getMonth() - 2), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() + 183), (displayed_date.getMonth() - 2), displayed_date.getDate() + 20);
                }
            }
            else {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() + 181), (displayed_date.getMonth() + 7), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() + 183), (displayed_date.getMonth() + 7), displayed_date.getDate() + 20);
                }
            }
        }
    }
    stopDateHopping() {
        clearInterval(this.dateHoppingAnimationID);
        updatedate(this.userwasviewing.getFullYear(), this.userwasviewing.getMonth(), this.userwasviewing.getDate());
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
    const cookies = document.cookie.split('; ');
    let cookievalue;
    //const cookieMap = {};
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (nametofind === name) {
            cookievalue = value;
        }
    });
    return cookievalue;
}
function clearCookie(cookiename) {
    console.log(cookiename + "=;" + " path=/; domain=" + window.location.hostname);
    document.cookie = cookiename + "=;" + " path=/; domain=" + window.location.hostname;
}

var xhttpcheck = new XMLHttpRequest();
function isLoggedIn(loadPage) {
    const username = getCookie("username");
    const authToken = getCookie("authToken");
    if (username !== undefined || authToken !== undefined) {
        console.log("entered check");
        if (xhttpcheck.readyState === 0 || xhttpcheck.readyState === 4) {
            xhttpcheck.open("POST", "/checktokenauthenticity", true);
            xhttpcheck.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttpcheck.send("username=" + username + "&authToken=" + authToken);
        }
        xhttpcheck.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const result = JSON.parse(xhttpcheck.response);
                console.log("Authentic:" + result.authentic);
                loadPage(result.authentic);
            }
        };
    }
    else {
        console.log("Cookies don't exist");
        loadPage(false);
    }
}


function loadTable(check) {
    if (check === true) {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "4.5vw");
        const currentdate = new Date();
        generateCalendarHeading();
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
function generateCalendarHeading() {
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
}

function generateWelcomeCalendar() {
    const table = document.getElementById('calendar');
    generateCalendarHeading();

    const innhtml = [
        "<a href=\"/home\">Home</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/about\">Help/<br>Support</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/about\">About</a>",
        "<a href=\"/signup\">Sign<br>Up</a>",
        "<a href=\"/login\">Log<br>In</a>"
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



function addsidebarcontent() {
    addsidebar1content();
    addsidebar2content();
}
function addsidebar2content() {
    const sidebar = document.getElementById('calsidebar2');
    sidebar.innerHTML = "";
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    const cellcontent = [
        "<a href=\"javascript:showdatepicker();\" style=\"background-color: rgb(0, 182, 67)\">" + displayed_date.getDate() + "</a>",
        "<a href=\"javascript:showdatepicker();\" style=\"background-color: rgb(0, 182, 67)\">" + months[displayed_date.getMonth()].shortname + "</a>",
        "<a href=\"javascript:showdatepicker();\" style=\"background-color: rgb(0, 182, 67)\">" + displayed_date.getFullYear() + "</a>",
        "<a href=\"javascript:timeHop();\" style=\"background-color: rgb(0, 160, 246);\">" + "Time<br>Hop" + "</a>"
    ];
    if (css_devicesmall === "false") {
        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
            sidebar.appendChild(tr);
        }
    }
    else {
        const tr = document.createElement('tr');
        for (let i = 0; i < 4; i++) {
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
        }
        sidebar.appendChild(tr);
    }
}
function addsidebar1content() {
    const sidebar = document.getElementById('calsidebar1');
    sidebar.innerHTML = "";
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    const cellcontent = [
        "<a href=\"javascript:();\" id=\"aichatbtn\"><img class=\"sidebarimgs\" id=\"aichatimg\" alt=\"AI Chat\">" + "</a>",
        "<a href=\"javascript:openEvents();\" id=\"eventslistbtn\"><img class=\"sidebarimgs\" id=\"eventslistimg\" alt=\"Events List\">" + "</a>",
        "<a href=\"javascript:openAIchat();\" id=\"aichatbtn\"><img class=\"sidebarimgs\" id=\"aichatimg\" alt=\"AI Chat\">" + "</a>",
        "<a href=\"javascript:openAccountandSettings();\" id=\"useraccountbtn\"><img class=\"sidebarimgs\" id=\"useraccountimg\" alt=\"User Account\">" + "</a>"
    ];
    if (css_devicesmall === "false") {
        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
            sidebar.appendChild(tr);
        }
    }
    else {
        const tr = document.createElement('tr');
        for (let i = 0; i < 4; i++) {
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
        }
        sidebar.appendChild(tr);
    }
}

function openAccountandSettings() {
    const content = document.createElement("div");
    const name = document.createElement("div");
    const logout = document.createElement("button");
    name.innerHTML = "Nick Name<br>@" + getCookie("username");
    logout.innerText = "Log Out";
    logout.setAttribute("onclick", "clearCookie(\"username\"); clearCookie(\"authToken\"); window.location.href = \"/home\";");

    content.appendChild(name);
    content.appendChild(logout);
    openWindow("Account and Settings", content);
}
function openAIchat() {
    const content = document.createElement("div");
    openWindow("AI Chat(Gemini)", content);
}

let upcomingeventslist = [];
let curr_date;
let curr_time;
function openEvents() {
    upcomingeventslist = [];
    const content = document.createElement("div");
    openWindow("Events", content);
    startTopBarAnimation(null);
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
    reqUpcomingEvent(curr_date, curr_time, 0);
}
var xhttpeventsrequest = new XMLHttpRequest();
function reqUpcomingEvent(currdate, currtime, lastrec_eventid) {
    if (xhttpeventsrequest.readyState === 0 || xhttpeventsrequest.readyState === 4) {
        xhttpeventsrequest.open("POST", "/upcomingeventrequest", true);
        xhttpeventsrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpeventsrequest.send("username=" + getCookie("username") + "&currentdate=" + currdate + "&currenttime=" + currtime + "&lastreceivedeventid=" + lastrec_eventid);
    }
    xhttpeventsrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(xhttpeventsrequest.response);
            if (res.eventfound === true) {
                upcomingeventslist.push(res);
                updateUpcomingEventsListOutput();
            }
            else {
                upcomingeventslist.push(res);
                updateUpcomingEventsListOutput();
                stopTopBarAnimation(null);
            }
        }
    };
}
function updateUpcomingEventsListOutput() {
    const wbody = document.getElementsByClassName("windowbody")[0];
    if(upcomingeventslist[upcomingeventslist.length - 1].eventfound === true) {
        const eventcard = document.createElement("div");
        const ename = document.createElement("h4");
        const edescription = document.createElement("p");
        ename.innerText = upcomingeventslist[upcomingeventslist.length - 1].name;
        ename.style = "border: 0.5px solid #000; margin: 0;";
        edescription.innerText = upcomingeventslist[upcomingeventslist.length - 1].description;
        edescription.style = "margin-top: 1%; margin-bottom: 2%; font-size: 55%;"
        eventcard.style = "border: 2px solid #000; background:white;";
        eventcard.appendChild(ename);
        eventcard.appendChild(edescription);
        wbody.appendChild(eventcard);
        reqUpcomingEvent(curr_date, curr_time, upcomingeventslist[upcomingeventslist.length -1].eventid);
    }
}

function openWindow(headingname, content) {
    const table = document.getElementById('calendar');
    const datebuttonsbar = document.getElementById('calsidebar2');
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    if (css_devicesmall === "false") {
        datebuttonsbar.innerHTML = "<tr><td>Close</td></tr><tr><td>Window</td></tr><tr><td>To</td></tr><tr><td>Use</td></tr>"
    }
    else {
        datebuttonsbar.innerHTML = "<tr><td>Close</td><td>Window</td><td>To</td><td>Use</td></tr>"
    }
    deletetable();
    setWindowHeader(table, headingname);
    setWindowBody(table, content);
}
function closeWindow() {
    generateCalendarHeading();
    fillCalendar(displayed_date);
    addsidebar2content();
}
function setWindowHeader(table, headingname) {
    while (table.children.length !== 0) {
        table.removeChild(table.children[0]);
    }
    const heading = document.createElement('th');
    const title = document.createElement('p');
    const closebutton = document.createElement('button');

    heading.classList.add("calendarwindowheader");
    title.innerText = headingname;
    title.classList.add("calendarwindowheading");
    closebutton.innerText = "X";
    closebutton.classList.add("calendarwindowclosebutton");
    closebutton.onclick = function () { closeWindow() };
    heading.style = "width: 100%; padding-right: 0vmin; padding-left: 0vmin; border-left-width: 0px; border-right-width: 0px; border-top-width: 1px; margin-left: 0px;";

    heading.appendChild(title);
    heading.appendChild(closebutton);
    table.appendChild(heading);
}
function setWindowBody(table, content) {
    const windowbody = document.createElement('tr');
    const wbodydiv = document.createElement('div');

    wbodydiv.innerHTML = content.innerHTML;
    wbodydiv.style = "overflow:scroll; height: 100%; width: 100%;";
    windowbody.classList.add("windowbody");

    windowbody.appendChild(wbodydiv);
    table.appendChild(windowbody);
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
    for (const [index, cell] of cells.entries()) {
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
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}