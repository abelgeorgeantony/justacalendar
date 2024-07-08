function getCookie(nametofind) {
    const cookies = document.cookie.split('; ');
    let cookievalue;
    cookies.forEach(cookie => {
        const [name, value] = cookie.split('=');
        if (nametofind === name) {
            cookievalue = value;
        }
    });
    return cookievalue;
}


function showdatepicker() {
    const inputfields = document.getElementById("datepicker").querySelectorAll("input");
    inputfields[0].value = displayed_date.getDate();
    inputfields[1].value = months[displayed_date.getMonth()].fullname;
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
        //document.getElementById("datepicker").style.transform = "translateY(-50%)";
    }
}

let clickeddate;
function showeventpopup(element) {
    if (element !== null) {
        console.log(element);
        clickeddate = displayed_date.getFullYear();
        if (displayed_date.getMonth() < 9) {
            clickeddate = clickeddate + "-0" + (displayed_date.getMonth() + 1);
        }
        else {
            clickeddate = clickeddate + "-" + (displayed_date.getMonth() + 1);
        }
        if (Number(element.textContent) < 10) {
            clickeddate = clickeddate + "-0" + element.textContent;
        }
        else {
            clickeddate = clickeddate + "-" + element.textContent;
        }
        console.log(clickeddate);
        switchtoEventList();
    }
    else {
        clickeddate = element;
        switchtoInfoByAI();
    }
    dragPopUp(document.getElementById("eventpopup"));
    document.getElementById("eventpopupcontainer").style.zIndex = "9";
}
function hideeventpopup() {
    if (document.getElementById("eventpopupbody").parentElement.children.length === 3) {
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


let eventslist = [];
function switchtoEventList() {
    closeEventsDropdown();
    document.getElementById("eventsdropbtn").innerHTML = "Events&#11167;";
    document.getElementById("eventsDropdown").children[0].innerText = "Add Event";
    document.getElementById("eventsDropdown").children[0].href = "javascript:switchtoEventAdder();";
    document.getElementById("eventsDropdown").children[1].innerText = "Info by AI";
    document.getElementById("eventsDropdown").children[1].href = "javascript:switchtoInfoByAI();";

    eventslist = [];
    document.getElementById("eventpopupbody").setAttribute("style", "overflow:scroll; height: 40vh");
    const cdate = new Date(clickeddate).getDate() + "/" + (new Date(clickeddate).getMonth() + 1) + "/" + new Date(clickeddate).getFullYear();
    const datecard = document.createElement("div");
    datecard.innerText = cdate;
    datecard.style = "position: fixed; background: black; color: white;";
    const datecarddummy = document.createElement("div");
    datecarddummy.innerText = cdate;
    datecarddummy.style = "color: #0000; background: #0000"
    document.getElementById("eventpopupbody").appendChild(datecard);
    document.getElementById("eventpopupbody").appendChild(datecarddummy);
    startTopBarAnimation(null);
    reqEventListofdayFromDB(clickeddate, 0);
}
function switchtoEventAdder() {
    closeEventsDropdown();
    document.getElementById("eventsdropbtn").innerHTML = "Add Event&#11167;";
    document.getElementById("eventsDropdown").children[0].innerText = "Events";
    document.getElementById("eventsDropdown").children[0].href = "javascript:switchtoEventList();";
    document.getElementById("eventsDropdown").children[1].innerText = "Info by AI";
    document.getElementById("eventsDropdown").children[1].href = "javascript:switchtoInfoByAI();";

    const eventdateinputtitle = document.createElement("h4");
    const eventdateinput = document.createElement("input");
    const eventtimeinputtitle = document.createElement("h4");
    const eventtimeinput = document.createElement("input");
    const eventnameinputtitle = document.createElement("h4");
    const eventnameinput = document.createElement("input");
    const eventdescriptiontitle = document.createElement("h4");
    const eventdescription = document.createElement("textarea");
    const addeventbtn = document.createElement("button");

    eventdateinputtitle.innerText = "Date:";
    eventdateinputtitle.classList.add("eventinputfieldtitle");
    eventdateinput.type = "date";
    eventdateinput.value = clickeddate;
    eventdateinput.classList.add("eventinputfield");

    eventtimeinputtitle.innerText = "Time:";
    eventtimeinputtitle.classList.add("eventinputfieldtitle");
    eventtimeinput.type = "time";
    if (new Date().getHours() < 10) {
        if (new Date().getMinutes() < 10) {
            eventtimeinput.value = ("0" + new Date().getHours() + ":0" + new Date().getMinutes());
        }
        else {
            eventtimeinput.value = ("0" + new Date().getHours() + ":" + new Date().getMinutes());
        }
    }
    else {
        if (new Date().getMinutes() < 10) {
            eventtimeinput.value = (new Date().getHours() + ":0" + new Date().getMinutes());
        }
        else {
            eventtimeinput.value = (new Date().getHours() + ":" + new Date().getMinutes());
        }
    }
    console.log(eventtimeinput.value);
    eventtimeinput.classList.add("eventinputfield");

    eventnameinputtitle.innerText = "Event Name:";
    eventnameinputtitle.classList.add("eventinputfieldtitle");
    eventnameinput.type = "text";
    eventnameinput.classList.add("eventinputfield");

    eventdescriptiontitle.innerText = "Event Description:";
    eventdescriptiontitle.classList.add("eventinputfieldtitle");
    eventdescription.type = "text";
    eventdescription.rows = 4;
    eventdescription.classList.add("eventinputfield");

    addeventbtn.innerText = "Add the Event!";
    addeventbtn.onclick = function () { addEventToDB(); };

    document.getElementById("eventpopupbody").appendChild(eventdateinputtitle);
    document.getElementById("eventpopupbody").appendChild(eventdateinput);
    document.getElementById("eventpopupbody").appendChild(eventtimeinputtitle);
    document.getElementById("eventpopupbody").appendChild(eventtimeinput);
    document.getElementById("eventpopupbody").appendChild(eventnameinputtitle);
    document.getElementById("eventpopupbody").appendChild(eventnameinput);
    document.getElementById("eventpopupbody").appendChild(eventdescriptiontitle);
    document.getElementById("eventpopupbody").appendChild(eventdescription);
    document.getElementById("eventpopupbody").appendChild(addeventbtn);
}
function switchtoInfoByAI() {
    closeEventsDropdown();
    document.getElementById("eventsdropbtn").innerHTML = "Info by AI&#11167;";
    document.getElementById("eventsDropdown").children[0].innerText = "Events";
    document.getElementById("eventsDropdown").children[0].href = "javascript:switchtoEventList();";
    document.getElementById("eventsDropdown").children[1].innerText = "Add Event";
    document.getElementById("eventsDropdown").children[1].href = "javascript:switchtoEventAdder();";


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
    clickeddate = displayed_date;
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
function addEventToDB() {
    let dateofevent = document.getElementById("eventpopupbody").children[1].value;
    let timeofevent = document.getElementById("eventpopupbody").children[3].value;
    let nameofevent = document.getElementById("eventpopupbody").children[5].value;
    let descriptionofevent = document.getElementById("eventpopupbody").children[7].value;

    if (xhttpeventsubmit.readyState === 0 || xhttpeventsubmit.readyState === 4) {
        startTopBarAnimation(document.getElementById("eventpopupbody").children[document.getElementById("eventpopupbody").children.length - 1]);
        xhttpeventsubmit.open("POST", "/eventsubmit", true);
        xhttpeventsubmit.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpeventsubmit.send("username=" + getCookie("username") + "&date=" + dateofevent + "&time=" + timeofevent + "&name=" + nameofevent + "&description=" + descriptionofevent);
    }
    xhttpeventsubmit.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const result = JSON.parse(xhttpeventsubmit.response);
            if (result.eventadded === true) {
                switchtoEventList();
                stopTopBarAnimation(document.getElementById("eventpopupbody").children[document.getElementById("eventpopupbody").children.length - 1]);
            }
        }
    };

}

var xhttpeventrequest = new XMLHttpRequest();
function reqEventListofdayFromDB(dateofevent, lastreceivedeventid) {
    if (xhttpeventrequest.readyState === 0 || xhttpeventrequest.readyState === 4) {
        //startTopBarAnimation();
        xhttpeventrequest.open("POST", "/eventofdayrequest", true);
        xhttpeventrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpeventrequest.send("username=" + getCookie("username") + "&date=" + dateofevent + "&lastreceivedeventid=" + lastreceivedeventid);
    }
    xhttpeventrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const resfromdb = JSON.parse(xhttpeventrequest.response);
            if (resfromdb.eventfound === true) {
                eventslist.push(resfromdb);
                console.log(eventslist[eventslist.length - 1]);
                updateEventListofdayOutput();
            }
            else {
                eventslist.push(resfromdb);
                updateEventListofdayOutput();
                stopTopBarAnimation(null);
            }
        }
    };
}
function updateEventListofdayOutput() {
    if (eventslist[0].eventfound === false || eventslist.length === 0) {
        document.getElementById("eventpopupbody").innerHTML = document.getElementById("eventpopupbody").innerHTML + "<br>Add an event to list it here!";
    }
    else if (eventslist[eventslist.length - 1].eventfound === true) {
        const eventcard = document.createElement("div");
        const ename = document.createElement("h4");
        const edescription = document.createElement("p");
        ename.innerText = eventslist[eventslist.length - 1].name;
        ename.style = "border: 0.5px solid #000; margin: 0;";
        edescription.innerText = eventslist[eventslist.length - 1].description;
        edescription.style = "margin-top: 1%; margin-bottom: 2%; font-size: 55%;"
        eventcard.style = "border: 2px solid #000; background:white;";
        eventcard.appendChild(ename);
        eventcard.appendChild(edescription);
        document.getElementById("eventpopupbody").appendChild(eventcard);
        reqEventListofdayFromDB(clickeddate, eventslist[eventslist.length - 1].eventid);
    }
}

function startTopBarAnimation(element) {
    if (element !== null && element !== undefined) {
        element.setAttribute("disabled", "true");
    }
    document.querySelector(".eventloadingcontainer").style.zIndex = "99";
    document.querySelector(".loadingrunner").style.animationIterationCount = "infinite";
}
function stopTopBarAnimation(element) {
    document.querySelector(".eventloadingcontainer").style.zIndex = "-99";
    document.querySelector(".loadingrunner").style.animationIterationCount = "0";
    if (element !== null && element !== undefined) {
        element.removeAttribute("disabled");
    }
}