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
    const chatcontainer = document.createElement("div");

    const chathistory = document.createElement("div");
    chathistory.innerHTML = "asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>asfasdffffffffffffff<br>";
    const messageinputdiv = document.createElement("div");
    const messageinput = document.createElement("textarea");
    const sendbtn = document.createElement("button");

    chatcontainer.style = "display:flex; flex-direction: column; height: 100%; width: 100%;";

    chathistory.style = "height: inherit; overflow: scroll;";

    messageinput.rows = 1;
    messageinput.style = "width: 100%; font-size: 140%; padding-top: 2.5%";
    sendbtn.innerText = "Send";
    sendbtn.style = "height: 100%;";
    messageinputdiv.style = "display: flex; margin-bottom: 0.2%; margin-left: 0.1%; margin-right: 0.1%;";

    messageinputdiv.appendChild(messageinput);
    messageinputdiv.appendChild(sendbtn);

    chatcontainer.appendChild(chathistory);
    chatcontainer.appendChild(messageinputdiv);
    content.appendChild(chatcontainer);
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
    if (upcomingeventslist[upcomingeventslist.length - 1].eventfound === true) {
        const eventcard = document.createElement("div");
        const edatetimeinfo = document.createElement("div");
        const eventinfo = document.createElement("div");
        const ename = document.createElement("h4");
        const edescription = document.createElement("p");

        const datetime = new Date(upcomingeventslist[upcomingeventslist.length - 1].datetime.slice(0, -1));
        console.log(datetime);
        const edate = formatDate(datetime.getDate(), (datetime.getMonth() + 1), datetime.getFullYear());
        const etime = formatTime(datetime.getHours(), datetime.getMinutes(), 12) + " " + findAmPm(datetime.getHours());
        edatetimeinfo.innerHTML = edate + "<br>" + etime;
        edatetimeinfo.style = "margin-right: 1%; margin-left: 1%; align-self: center;"
        ename.innerText = upcomingeventslist[upcomingeventslist.length - 1].name;
        ename.style = "border-bottom: 1.5px solid #000; margin: 0; padding-left: 2%; font-size: 200%;";
        edescription.innerText = upcomingeventslist[upcomingeventslist.length - 1].description;
        edescription.style = "padding-left: 2%; margin-top: 1%; margin-bottom: 1.5%; font-size: 95%;";

        eventinfo.appendChild(ename);
        eventinfo.appendChild(edescription);
        eventinfo.style = "border-right: 2px solid #000; background:white; display:flex; flex-direction: column; width: 100%";
        eventcard.style = "border-bottom: 3.5px solid #000; background:white; display:flex; flex-direction: row; justify-content:space-between;";
        eventcard.appendChild(eventinfo);
        eventcard.appendChild(edatetimeinfo);
        wbody.children[0].appendChild(eventcard);
        reqUpcomingEvent(curr_date, curr_time, upcomingeventslist[upcomingeventslist.length - 1].eventid);
    }
}
let sortedEventsList = [];
function sortEvents() {
    startTopBarAnimation(null);
    const events = document.getElementsByClassName("windowbody")[0].children[0];
    for(let i = 0; i < events.children.length; i++) {
        sortedEventsList[i] = events.children[i];
    }
    for (let j = 0; j < sortedEventsList.length; j++) {
        for (let i = 0; i < sortedEventsList.length - 1; i++) {
            if (getDateTimeFromCard(sortedEventsList[i]) > getDateTimeFromCard(sortedEventsList[i + 1])) {
                const tempcard = sortedEventsList[i];
                sortedEventsList[i] = sortedEventsList[i + 1];
                sortedEventsList[i + 1] = tempcard;
            }
        }
    }
    events.innerHTML = "";
    for(let j = 0; j < sortedEventsList.length; j++) {
        events.appendChild(sortedEventsList[j]);
    }
    stopTopBarAnimation(null);
}
function getDateTimeFromCard(ecard) {
    let dateandtime = ecard.children[1].innerText.split(/\r?\n/);
    const datebroken = dateandtime[0].split("/");
    dateandtime[0] = datebroken[2] + "/" + datebroken[1] + "/" + datebroken[0];
    const eventdateandtime = new Date(dateandtime[0]);
    const timebroken = deformatTime(dateandtime[1]);
    eventdateandtime.setHours(timebroken[0], timebroken[1]);
    //console.log(eventdateandtime);
    return eventdateandtime;
}



function openWindow(headingname, content) {
    const table = document.getElementById('calendar');
    const datebuttonsbar = document.getElementById('calsidebar2');
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    if (css_devicesmall === "false") {
        datebuttonsbar.innerHTML = "<tr><td><a href=\"javascript:sortEvents();\">Sort</a></td></tr><tr><td>Window</td></tr><tr><td>To</td></tr><tr><td>Use</td></tr>"
    }
    else {
        datebuttonsbar.innerHTML = "<tr><td><a href=\"javascript:sortEvents();\">Sort</a></td><td>Window</td><td>To</td><td>Use</td></tr>"
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
function findAmPm(hour) {
    if (Number(hour) < 12) {
        return "am";
    }
    return "pm";
}