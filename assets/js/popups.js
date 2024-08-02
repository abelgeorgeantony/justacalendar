/*function getCookie(nametofind) {
    const cookies = document.cookie.split('; ');
    let cookievalue;
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (nametofind === name) {
            cookievalue = value;
        }
    });
    return cookievalue;
}*/


function showdatepicker() {
    const inputfields = document.getElementById("datepicker").querySelectorAll("input");
    inputfields[0].value = displayed_date.getDate();
    inputfields[1].value = months[displayed_date.getMonth()].full;
    inputfields[2].value = displayed_date.getFullYear();
    dragPopUp(document.getElementById("datepicker"));
    document.getElementById("datepickercontainer").style.zIndex = "9";
    inputfields[0].readOnly = false;
    inputfields[1].readOnly = false;
    inputfields[2].readOnly = false;
}
function hidedatepicker() {
    const inputfields = document.getElementById("datepicker").querySelectorAll("input");
    inputfields[0].readOnly = true;
    inputfields[1].readOnly = true;
    inputfields[2].readOnly = true;
    document.getElementById("datepickercontainer").style.zIndex = "-1";
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    if (css_devicesmall === "false") {
        document.getElementById("datepicker").style.top = "50%";
        document.getElementById("datepicker").style.left = "50%";
        document.getElementById("datepicker").style.transform = 'translate(-50%, -50%)';
    }
}

let clickeddate;
/**afteradding legal parameters-"showeventwindow","showmonthcalendar"*/
function showeventpopup(element, afteraction) {
    if (element === "infobyai") {
        switchtoInfoByAI(afteraction);
    }
    else if (element === "eventslist" || element.tagName === "TD") {
        console.log(element);
        clickeddate = displayed_date.getFullYear();
        if (displayed_date.getMonth() < 9) {
            clickeddate = clickeddate + "-0" + (displayed_date.getMonth() + 1);
        }
        else {
            clickeddate = clickeddate + "-" + (displayed_date.getMonth() + 1);
        }
        let dateincell;
        if (element === "eventslist") {
            dateincell = displayed_date.getDate();
        }
        else {
            console.log(element.textContent.split(element.children[0].textContent)[1]);
            dateincell = element.textContent.split(element.children[0].textContent)[1];
        }
        if (Number(dateincell) < 10) {
            clickeddate = clickeddate + "-0" + dateincell;
        }
        else {
            clickeddate = clickeddate + "-" + dateincell;
        }
        console.log(clickeddate);
        switchtoEventList(afteraction);
    }
    else if (element === "addanevent") {
        switchtoEventAdder(afteraction);
    }
    dragPopUp(document.getElementById("eventpopup"));
    document.getElementById("eventpopupcontainer").style.zIndex = "9";
}
function hideeventpopup() {
    clickeddate = null;
    if (document.getElementById("eventpopupbody").parentElement.children.length === 3) {
        //If the event popup was in infobyai mode then this branch
        //deletes the ai warning that's shown at the bottom
        document.getElementById("eventpopupbody").parentElement.removeChild(document.getElementById("eventpopupbody").parentElement.children[2]);
    }
    document.getElementById("eventpopupbody").innerHTML = "";
    document.getElementById("eventpopupcontainer").style.zIndex = "-1";
    document.getElementById("eventpopup").style.top = "50%";
    document.getElementById("eventpopup").style.left = "50%";
    document.getElementById("eventpopup").style.transform = 'translate(-50%, -50%)';
}

function dragPopUp(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


let singledayeventslist = [];
function switchtoEventList(afteraction) {
    closeEventsDropdown();
    document.getElementById("eventsdropbtn").innerHTML = "Events&#11167;";
    document.getElementById("eventsDropdown").children[0].innerText = "Add Event";
    document.getElementById("eventsDropdown").children[0].href = "javascript:switchtoEventAdder('" + afteraction + "');";
    document.getElementById("eventsDropdown").children[1].innerText = "Info by AI";
    document.getElementById("eventsDropdown").children[1].href = "javascript:switchtoInfoByAI('" + afteraction + "');";

    singledayeventslist = [];
    document.getElementById("eventpopupbody").setAttribute("style", "overflow:scroll; height: 40vh");
    const cdate = new Date(clickeddate).getDate() + "/" + (new Date(clickeddate).getMonth() + 1) + "/" + new Date(clickeddate).getFullYear();
    const datecard = document.createElement("div");
    datecard.innerText = cdate;
    datecard.style = "position: fixed; background: black; color: white;";
    const datecarddummy = document.createElement("div");
    datecarddummy.innerText = cdate;
    datecarddummy.style = "color: #0000; background: #0000";
    document.getElementById("eventpopupbody").append(datecard, datecarddummy);
    startTopBarAnimation(null);
    reqEventListofdayFromDB(clickeddate);
}
function switchtoEventAdder(afteraction) {
    closeEventsDropdown();
    document.getElementById("eventsdropbtn").innerHTML = "Add Event&#11167;";
    document.getElementById("eventsDropdown").children[0].innerText = "Events";
    document.getElementById("eventsDropdown").children[0].href = "javascript:switchtoEventList('" + afteraction + "');";
    document.getElementById("eventsDropdown").children[1].innerText = "Info by AI";
    document.getElementById("eventsDropdown").children[1].href = "javascript:switchtoInfoByAI('" + afteraction + "');";

    const topsection = document.createElement("div");
    const tlsection = document.createElement("div");
    const trsection = document.createElement("div");

    const eventdateinputtitle = document.createElement("h4");
    const eventdateinput = document.createElement("input");
    const eventtimeinputtitle = document.createElement("h4");
    const eventtimeinput = document.createElement("input");
    const eventnameinputtitle = document.createElement("h4");
    const eventnameinput = document.createElement("input");
    const eventcolorinputtitle = document.createElement("h4");
    const eventcolorinput = document.createElement("input");
    const predefinedcolors = document.createElement("div");

    const eventdescriptiontitle = document.createElement("h4");
    const eventdescription = document.createElement("textarea");
    const addeventbtn = document.createElement("button");

    eventdateinputtitle.innerText = "Date:";
    eventdateinputtitle.classList.add("eventinputfieldtitle");
    eventdateinput.type = "date";
    eventdateinput.value = clickeddate;
    eventdateinput.classList.add("eventinputfield");
    eventdateinput.style = "width: 80%;";

    eventtimeinputtitle.innerText = "Time:";
    eventtimeinputtitle.classList.add("eventinputfieldtitle");
    eventtimeinput.type = "time";
    eventtimeinput.value = formatTime(new Date().getHours(), new Date().getMinutes(), 24);
    console.log(eventtimeinput.value);
    eventtimeinput.classList.add("eventinputfield");
    eventtimeinput.style = "width: 80%;";

    eventcolorinputtitle.innerText = "Color:";
    eventcolorinputtitle.classList.add("eventinputfieldtitle");
    //predefinedcolors.
    eventcolorinput.type = "color";
    eventcolorinput.value = "#ff0000";
    eventcolorinput.classList.add("eventinputfield");
    eventcolorinput.style = "width: 100%;";

    eventnameinputtitle.innerText = "Event Name:";
    eventnameinputtitle.classList.add("eventinputfieldtitle");
    eventnameinput.type = "text";
    eventnameinput.classList.add("eventinputfield");
    eventnameinput.style = "width: 80%;";

    eventdescriptiontitle.innerText = "Event Description:";
    eventdescriptiontitle.classList.add("eventinputfieldtitle");
    eventdescription.type = "text";
    eventdescription.rows = 4;
    eventdescription.classList.add("eventinputfield");

    addeventbtn.innerText = "Add the Event!";
    addeventbtn.onclick = function () { addEventToDB(afteraction); };

    topsection.style = "display: flex; flex-direction: row;";
    tlsection.style = "display: flex; flex-direction: column;";
    trsection.style = "display: flex; flex-direction: column; width: 45%;";

    tlsection.append(eventdateinputtitle, eventdateinput, eventtimeinputtitle, eventtimeinput, eventnameinputtitle, eventnameinput);
    trsection.append(eventcolorinputtitle, predefinedcolors, eventcolorinput);
    topsection.append(tlsection, trsection);
    /*document.getElementById("eventpopupbody").appendChild(eventdateinputtitle);
    document.getElementById("eventpopupbody").appendChild(eventdateinput);
    document.getElementById("eventpopupbody").appendChild(eventtimeinputtitle);
    document.getElementById("eventpopupbody").appendChild(eventtimeinput);
    document.getElementById("eventpopupbody").appendChild(eventnameinputtitle);
    document.getElementById("eventpopupbody").appendChild(eventnameinput);*/
    document.getElementById("eventpopupbody").appendChild(topsection);
    document.getElementById("eventpopupbody").appendChild(eventdescriptiontitle);
    document.getElementById("eventpopupbody").appendChild(eventdescription);
    document.getElementById("eventpopupbody").appendChild(addeventbtn);
}
function switchtoInfoByAI(afteraction) {
    closeEventsDropdown();
    document.getElementById("eventsdropbtn").innerHTML = "Info by AI&#11167;";
    document.getElementById("eventsDropdown").children[0].innerText = "Events";
    document.getElementById("eventsDropdown").children[0].href = "javascript:switchtoEventList('" + afteraction + "');";
    document.getElementById("eventsDropdown").children[1].innerText = "Add Event";
    document.getElementById("eventsDropdown").children[1].href = "javascript:switchtoEventAdder('" + afteraction + "');";


    document.getElementById("eventpopupbody").setAttribute("style", "overflow:scroll; height: 40vh");
    const infobox = document.createElement("div");
    const datetoprint = rdate.date.getDate() + "/" + (rdate.date.getMonth() + 1) + "/" + rdate.date.getFullYear();
    infobox.innerHTML = datetoprint + "<br>" + rdate.info;
    infobox.style = "background: white;"
    document.getElementById("eventpopupbody").appendChild(infobox);
    const aiwarning = document.createElement("p");
    aiwarning.style = "margin: 2%"
    aiwarning.innerHTML = "&#8505; Information generated by AI is not trustable!";
    document.getElementById("eventpopupbody").parentElement.appendChild(aiwarning);
    //clickeddate = displayed_date;
}
function showEventsDropdown() {
    document.getElementById("eventsDropdown").classList.toggle("show");
}
function closeEventsDropdown() {
    if (document.getElementById("eventpopupbody").parentElement.children.length === 3) {
        document.getElementById("eventpopupbody").parentElement.removeChild(document.getElementById("eventpopupbody").parentElement.children[2]);
    }
    document.getElementById("eventpopupbody").removeAttribute("style");
    document.getElementById("eventpopupbody").innerHTML = "";
    if (document.getElementById("eventsDropdown").classList.contains("show")) {
        document.getElementById("eventsDropdown").classList.remove("show");
    }
}


var xhttpeventsubmit = new XMLHttpRequest();
function addEventToDB(afteradding) {
    let dateofevent = document.getElementById("eventpopupbody").children[0].children[0].children[1].value;
    let timeofevent = document.getElementById("eventpopupbody").children[0].children[0].children[3].value;
    let colorofevent = document.getElementById("eventpopupbody").children[0].children[1].children[2].value;
    let nameofevent = document.getElementById("eventpopupbody").children[0].children[0].children[5].value;
    let descriptionofevent = document.getElementById("eventpopupbody").children[2].value;
    if (xhttpeventsubmit.readyState === 0 || xhttpeventsubmit.readyState === 4) {
        startTopBarAnimation(document.getElementById("eventpopupbody").children[document.getElementById("eventpopupbody").children.length - 1]);
        xhttpeventsubmit.open("POST", "/eventsubmit", true);
        xhttpeventsubmit.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpeventsubmit.send("username=" + getCookie("username") + "&date=" + dateofevent + "&time=" + timeofevent + "&color=" + colorofevent + "&name=" + nameofevent + "&description=" + descriptionofevent);
    }
    xhttpeventsubmit.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const result = JSON.parse(xhttpeventsubmit.response);
            if (result.eventadded === true) {
                upcomingeventslist.length = 0;
                if (afteradding === "showeventwindow") {
                    closeWindow();
                    openEvents();
                    hideeventpopup();
                }
                else if (afteradding === "showmonthcalendar") {
                    fillCalendar(displayed_date);
                    switchtoEventList(afteradding);
                }
                else {
                    hideeventpopup();
                }
                stopTopBarAnimation(document.getElementById("eventpopupbody").children[document.getElementById("eventpopupbody").children.length - 1]);
            }
        }
    };
}

var singledayeventsrequest = new XMLHttpRequest();
function reqEventListofdayFromDB(dateofevent) {
    if (singledayeventsrequest.readyState === 0 || singledayeventsrequest.readyState === 4) {
        //startTopBarAnimation();
        singledayeventsrequest.open("POST", "/eventsofdayrequest", true);
        singledayeventsrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        singledayeventsrequest.send("username=" + getCookie("username") + "&date=" + dateofevent);
    }
    singledayeventsrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const resfromdb = JSON.parse(singledayeventsrequest.response);
            if (resfromdb.eventsfound === true) {
                singledayeventslist = resfromdb.events;
                updateEventListofdayOutput();
            }
            else if (resfromdb.eventsfinished === true) {
                updateAsThereIsNoEventsForDay();
            }
            else if (resfromdb.error === true) {
                //updateEventsFetchingError();
            }
            stopTopBarAnimation(null);
        }
    };
}
function updateAsThereIsNoEventsForDay() {
    document.getElementById("eventpopupbody").innerHTML = document.getElementById("eventpopupbody").innerHTML + "<br>Add an event to list it here!";
    const specialeventsdiv = document.createElement("div");
    const date = Number(clickeddate.split("-")[2]);
    const holidays = getSingleDateHolidays(date, displayed_date.getMonth());
    for (let i = 0; i < holidays.length; i++) {
        const specialeventscard = document.createElement("div");
        specialeventscard.innerHTML = "&bull;" + holidays[i].name + "<br>";
        specialeventscard.style = "color: #f10000; display: block; white-space: nowrap; overflow: scroll; text-overflow: clip;";
        specialeventsdiv.appendChild(specialeventscard);
    }
    specialeventsdiv.style = "background-color: white;";
    document.getElementById("eventpopupbody").appendChild(specialeventsdiv);
}
function updateEventListofdayOutput() {
    for (let i = 0; i < singledayeventslist.length; i++) {
        const eventcard = document.createElement("div");
        const ename = document.createElement("h4");
        const edescription = document.createElement("p");
        const etime = document.createElement("p");
        ename.innerText = singledayeventslist[i].name;
        ename.style = "border: 0.5px solid #000; margin: 0; display: block; white-space: nowrap; overflow: scroll; text-overflow: clip;";
        edescription.innerText = singledayeventslist[i].description;
        edescription.style = "margin-top: 1%; margin-bottom: 0%; font-size: 55%; display: block; white-space: nowrap; overflow: scroll; text-overflow: clip;"
        eventcard.style = "border: 2px solid #000; background:white; display: flex; flex-direction: column;";
        const time = new Date(singledayeventslist[i].datetime.slice(0, -1));
        etime.innerText = formatTime(time.getHours(), time.getMinutes(), 12) + " " + findAmPm(time.getHours());
        etime.style = "align-self: end; margin-top: 1%; margin-bottom: 2%; margin-right: 1.5%; font-size: 40%; color: #616161;"

        eventcard.appendChild(ename);
        eventcard.appendChild(edescription);
        eventcard.appendChild(etime);
        document.getElementById("eventpopupbody").appendChild(eventcard);
    }
    const specialeventsdiv = document.createElement("div");
    const date = Number(clickeddate.split("-")[2]);
    const holidays = getSingleDateHolidays(date, displayed_date.getMonth());
    for (let i = 0; i < holidays.length; i++) {
        const specialeventscard = document.createElement("div");
        specialeventscard.innerHTML = "&bull;" + holidays[i].name + "<br>";
        specialeventscard.style = "color: #f10000; display: block; white-space: nowrap; overflow: scroll; text-overflow: clip;";
        specialeventsdiv.appendChild(specialeventscard);
    }
    specialeventsdiv.style = "background-color: white; "
    document.getElementById("eventpopupbody").appendChild(specialeventsdiv);
}


function fillEventAdder(date, time, name, description, color) {
    if ((date !== null) || (date !== undefined)) {
        document.getElementById("eventpopupbody").children[0].children[0].children[1].value = date;
    }
    if ((time !== null)||(time !== undefined)) {
        document.getElementById("eventpopupbody").children[0].children[0].children[3].value = time;
    }
    if ((name !== null)||(name !== undefined)) {
        document.getElementById("eventpopupbody").children[0].children[0].children[5].value = name;
    }
    if ((description !== null)||(description !== undefined)) {
        document.getElementById("eventpopupbody").children[2].value = description;
    }
    if ((color !== null) || (color !== undefined)) {
        document.getElementById("eventpopupbody").children[0].children[1].children[2].value = color;
    }
}