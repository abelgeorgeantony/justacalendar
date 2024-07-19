function openAccountandSettings() {
    const content = document.createElement("div");
    const name = document.createElement("div");
    const logout = document.createElement("button");
    name.innerHTML = "Nick Name<br>@" + getCookie("username");
    logout.innerText = "Log Out";
    logout.setAttribute("onclick", "clearCookie(\"username\"); clearCookie(\"authToken\"); window.location.href = \"/home\";");

    content.appendChild(name);
    content.appendChild(logout);

    const sidebarbtnscontent = [
        {
            fn: "test",
            btnname: "test"
        },
        {
            fn: "test2",
            btnname: "test"
        },
        {
            fn: "test3",
            btnname: "test"
        },
        {
            fn: "test4",
            btnname: "test"
        },
    ];
    openWindow("Account and Settings", content, sidebarbtnscontent);
}
function openAIchat() {
    const content = document.createElement("div");
    const chatcontainer = document.createElement("div");

    const chathistory = document.createElement("div");
    const messageinputdiv = document.createElement("div");
    const messageinput = document.createElement("textarea");
    const sendbtn = document.createElement("button");

    chatcontainer.style = "display:flex; flex-direction: column; height: 100%; width: 100%;";

    chathistory.style = "height: inherit; padding-top: 1%; overflow: scroll; display: flex; flex-direction: column;";

    messageinput.rows = 1;
    messageinput.style = "width: 90%; margin-left: 2.5%; font-size: 140%; padding-top: 2.5%; border: 2px solid #000;";
    sendbtn.innerText = "Send";
    sendbtn.setAttribute("onclick", "sendMessageToAi()");
    sendbtn.style = "height: 100%;";
    messageinputdiv.style = "display: flex; margin-bottom: 0.2%; margin-left: 0.1%; margin-right: 0.1%;";

    messageinputdiv.appendChild(messageinput);
    messageinputdiv.appendChild(sendbtn);

    chatcontainer.appendChild(chathistory);
    chatcontainer.appendChild(messageinputdiv);
    content.appendChild(chatcontainer);

    const sidebarbtnscontent = [
        {
            fn: "test",
            btnname: "test"
        },
        {
            fn: "isElementVisible()",
            btnname: "test Visible"
        },
        {
            fn: "test3",
            btnname: "test"
        },
        {
            fn: "test4",
            btnname: "test"
        }
    ];
    openWindow("AI Chat(Gemini)", content, sidebarbtnscontent);
    if(chathistorylist.length === 0 || chathistorylist[chathistorylist.length -1].chatsfinished === false) {
        reqChatHistory(-1);
    }
    else {
        addChatListToChatHistory();
    }
}
var xhttpchatrequest = new XMLHttpRequest();
function reqChatHistory(lastreceivedid) {
    if (xhttpchatrequest.readyState === 0 || xhttpchatrequest.readyState === 4) {
        xhttpchatrequest.open("POST", "/aichathistoryrequest", true);
        xhttpchatrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpchatrequest.send("username=" + getCookie("username") + "&lastreceivedid=" + lastreceivedid);
    }
    xhttpchatrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(xhttpchatrequest.response);
            addSingleChatHistory(res);
        }
    };
}
var xhttpmsgsubmit = new XMLHttpRequest();
function sendMessageToAi() {
    findandsetcurrdate_time();
    const msg = document.querySelector(".windowbody").children[0].children[0].children[1].children[0].value;
    console.log(msg);
    addUserMsgToOutput(msg);
    if (xhttpmsgsubmit.readyState === 0 || xhttpmsgsubmit.readyState === 4) {
        xhttpmsgsubmit.open("POST", "/aichatmsgsubmit", true);
        xhttpmsgsubmit.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpmsgsubmit.send("username=" + getCookie("username") + "&message=" + msg + "&date=" + curr_date + "&time=" + curr_time);
    }
    xhttpmsgsubmit.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(xhttpmsgsubmit.response);
            console.log(res.reply);
            addAIMsgToOutput(res.reply);
        }
    };
}
let chathistorylist = [];
function addSingleChatHistory(singlechat) {
    const chathistory = document.querySelector(".windowbody").children[0].children[0].children[0];
    if (singlechat.chatfound === true) {
        if (singlechat.chatinitby === "user") {
            chathistory.insertBefore(aiMsgBubble(singlechat.aimsg), chathistory.firstChild);
            chathistory.insertBefore(userMsgBubble(singlechat.usermsg), chathistory.firstChild);
        }
        reqChatHistory(singlechat.chatid)
    }
    else if(singlechat.chatsfinished === true){
        scrollToElement(chathistory.children[chathistory.children.length - 1]);
    }
    chathistorylist.push(singlechat);
}
function addChatListToChatHistory() {
    const chathistory = document.querySelector(".windowbody").children[0].children[0].children[0];
    for (let i = 0; i < chathistorylist.length-1; i++) {
        if (chathistorylist[i].chatinitby === "user") {
            chathistory.insertBefore(aiMsgBubble(chathistorylist[i].aimsg), chathistory.firstChild);
            chathistory.insertBefore(userMsgBubble(chathistorylist[i].usermsg), chathistory.firstChild);
        }
        else {
            chathistory.insertBefore(userMsgBubble(chathistorylist[i].usermsg), chathistory.firstChild);
            chathistory.insertBefore(aiMsgBubble(chathistorylist[i].aimsg), chathistory.firstChild);
        }
    }
    scrollToElement(chathistory.children[chathistory.children.length - 1]);
}
function addUserMsgToOutput(msgtoadd) {
    const msgfield = document.querySelector(".windowbody").children[0].children[0].children[1].children[0];
    const sendbtn = document.querySelector(".windowbody").children[0].children[0].children[1].children[1];
    msgfield.value = "";
    msgfield.setAttribute("disabled", "true");
    sendbtn.setAttribute("disabled", "true");
    const chathistory = document.querySelector(".windowbody").children[0].children[0].children[0];

    chathistory.appendChild(userMsgBubble(msgtoadd));
    scrollToElement(chathistory.children[chathistory.children.length - 1]);
}
function addAIMsgToOutput(msgtoadd) {
    const msgfield = document.querySelector(".windowbody").children[0].children[0].children[1].children[0];
    const sendbtn = document.querySelector(".windowbody").children[0].children[0].children[1].children[1];
    msgfield.removeAttribute("disabled");
    sendbtn.removeAttribute("disabled");
    const chathistory = document.querySelector(".windowbody").children[0].children[0].children[0];

    chathistory.appendChild(aiMsgBubble(msgtoadd));
    scrollToElement(chathistory.children[chathistory.children.length - 1]);
}




const upcomingeventslist = [];
function openEvents() {
    const content = document.createElement("div");
    const sidebarbtnscontent = [
        {
            fn: "sortEvents()",
            btnname: "Sort"
        },
        {
            fn: "test()",
            btnname: "test"
        },
        {
            fn: "test3",
            btnname: "test"
        },
        {
            fn: "test4",
            btnname: "test"
        },
    ];
    openWindow("Events", content, sidebarbtnscontent);
    if (upcomingeventslist.length === 0) {
        startTopBarAnimation(null);
        findandsetcurrdate_time();
        reqUpcomingEvent(curr_date, curr_time, 0, updateUpcomingEventsListOutput);
    }
    else if (upcomingeventslist[upcomingeventslist.length - 1].asjson.eventsfinished === true) {
        printUpcomingEventsList();
    }
}
function printUpcomingEventsList() {
    const events = document.getElementsByClassName("windowbody")[0].children[0];
    events.innerHTML = "";
    for (let i = 0; i < upcomingeventslist.length - 1; i++) {
        events.appendChild(upcomingeventslist[i].ashtml);
    }
}

const xhttpeventsrequest = new XMLHttpRequest();
function reqUpcomingEvent(currdate, currtime, lastrec_eventid, UpdateUI) {
    if (xhttpeventsrequest.readyState === 0 || xhttpeventsrequest.readyState === 4) {
        xhttpeventsrequest.open("POST", "/upcomingeventrequest", true);
        xhttpeventsrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpeventsrequest.send("username=" + getCookie("username") + "&currentdate=" + currdate + "&currenttime=" + currtime + "&lastreceivedeventid=" + lastrec_eventid);
    }
    xhttpeventsrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(xhttpeventsrequest.response);
            const eventfromdb = {
                ashtml: "",
                asjson: res
            };
            if (res.eventfound === true) {
                upcomingeventslist.push(eventfromdb);
                UpdateUI();
            }
            else {
                upcomingeventslist.push(eventfromdb);
                UpdateUI();
                stopTopBarAnimation(null);
            }
        }
    };
}
function updateUpcomingEventsListOutput() {
    const wbody = document.getElementsByClassName("windowbody")[0];
    if (upcomingeventslist[upcomingeventslist.length - 1].asjson.eventfound === true) {
        wbody.children[0].appendChild(createEventCard(upcomingeventslist[upcomingeventslist.length - 1]));
        const id = upcomingeventslist[upcomingeventslist.length - 1].asjson.eventid;
        reqUpcomingEvent(curr_date, curr_time, id, updateUpcomingEventsListOutput);
    }
}
function createEventCard(eventdata) {
    const eventcard = document.createElement("div");
    const edatetimeinfo = document.createElement("div");
    const eventinfo = document.createElement("div");
    const ename = document.createElement("h4");
    const edescription = document.createElement("p");

    const datetime = new Date(eventdata.asjson.datetime.slice(0, -1));
    const edate = formatDate(datetime.getDate(), (datetime.getMonth() + 1), datetime.getFullYear());
    const etime = formatTime(datetime.getHours(), datetime.getMinutes(), 12) + " " + findAmPm(datetime.getHours());

    edatetimeinfo.innerHTML = edate + "<br>" + etime;
    edatetimeinfo.style = "margin-right: 1%; margin-left: 1%; align-self: center;"
    ename.innerText = eventdata.asjson.name;
    ename.style = "border-bottom: 1.5px solid #000; margin: 0; padding-left: 2%; font-size: 200%;";
    if(eventdata.asjson.description !== "") {
        edescription.innerText = eventdata.asjson.description;
    edescription.style = "padding-left: 2%; margin-top: 1%; margin-bottom: 1.5%; font-size: 95%;";
    }

    eventinfo.appendChild(ename);
    eventinfo.appendChild(edescription);
    eventinfo.style = "border-right: 2px solid #000; background:white; display:flex; flex-direction: column; width: 100%";
    eventcard.style = "border-bottom: 3.5px solid #000; background:white; display:flex; flex-direction: row; justify-content:space-between;";
    eventcard.appendChild(eventinfo);
    eventcard.appendChild(edatetimeinfo);
    upcomingeventslist[upcomingeventslist.length - 1].ashtml = eventcard;
    return eventcard;
}
function sortEvents() {
    startTopBarAnimation(null);
    for (let j = 0; j < upcomingeventslist.length - 1; j++) {
        for (let i = 0; i < upcomingeventslist.length - 2; i++) {
            const current_eventdt = getDateTimeFromCard(upcomingeventslist[i].ashtml);
            const next_eventdt = getDateTimeFromCard(upcomingeventslist[i + 1].ashtml);
            if (current_eventdt > next_eventdt) {
                const temp = upcomingeventslist[i];
                upcomingeventslist[i] = upcomingeventslist[i + 1];
                upcomingeventslist[i + 1] = temp;
            }
        }
    }
    printUpcomingEventsList();
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



function openWindow(headingname, content, sidebarbtns) {
    document.getElementById("aisearchcontainer").style.zIndex = "-999";
    const table = document.getElementById('calendar');
    const datebuttonsbar = document.getElementById('calsidebar2');
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    if (css_devicesmall === "false") {
        datebuttonsbar.innerHTML = "<tr><td><a href=\"javascript:" + sidebarbtns[0].fn + ";\">" + sidebarbtns[0].btnname + "</a></td></tr><tr><td><a href=\"javascript:" + sidebarbtns[1].fn + ";\">" + sidebarbtns[1].btnname + "</a></td></tr><tr><td><a href=\"javascript:" + sidebarbtns[2].fn + ";\">" + sidebarbtns[2].btnname + "</a></td></tr><tr><td><a href=\"javascript:" + sidebarbtns[3].fn + ";\">" + sidebarbtns[3].btnname + "</a></td></tr>"
    }
    else {
        datebuttonsbar.innerHTML = "<tr><td><a href=\"javascript:" + sidebarbtns[0].fn + ";\">" + sidebarbtns[0].btnname + "</a></td><td><a href=\"javascript:" + sidebarbtns[1].fn + ";\">" + sidebarbtns[1].btnname + "</a></td><td><a href=\"javascript:" + sidebarbtns[2].fn + ";\">" + sidebarbtns[2].btnname + "</a></td><td><a href=\"javascript:" + sidebarbtns[3].fn + ";\">" + sidebarbtns[3].btnname + "</a></td></tr>"
    }
    deletetable();
    setWindowHeader(table, headingname);
    setWindowBody(table, content);
}
function closeWindow() {
    document.getElementById("aisearchcontainer").style.zIndex = "999";
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



function userMsgBubble(msg) {
    const msgbubble = document.createElement("div");
    msgbubble.innerText = msg;
    msgbubble.style = "align-self: end; border: 3px solid black; border-radius: 13px; border-top-right-radius: 0; padding: 5px; margin-right: 1%; margin-bottom: 0.5%; max-width: 70%;";
    return msgbubble;
}
function aiMsgBubble(msg) {
    const msgbubble = document.createElement("div");
    msgbubble.innerText = msg;
    msgbubble.style = "align-self: start; border: 3px solid black; border-radius: 13px; border-top-left-radius: 0; padding: 5px; margin-left: 1%; margin-bottom: 0.5%; max-width: 70%;";
    return msgbubble;
}


function isElementVisible(element = document.getElementsByClassName("windowbody")[0].children[0].children[0].children[0].children[0], partiallyVisible = false) {
    const { top, left, bottom, right } = element.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    console.log(partiallyVisible
        ? ((top > 0 && top < innerHeight) ||
            (bottom > 0 && bottom < innerHeight)) &&
        ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth);
};
function scrollToElement(element) {
    element.scrollIntoView(true);
}
