function openAccountandSettings() {
  const content = document.createElement("div");
  const name = document.createElement("div");
  const logout = document.createElement("button");
  name.innerHTML = "@" + getCookie("username");
  logout.innerText = "Log Out";
  logout.setAttribute(
    "onclick",
    'clearCookie("username"); clearCookie("authToken"); window.location.href = "/home";',
  );

  content.appendChild(name);
  content.appendChild(logout);

  const sidebarbtnscontent = [
    {
      fn: "test",
      btnname: "test",
    },
    {
      fn: "test2",
      btnname: "test",
    },
    {
      fn: "test3",
      btnname: "test",
    },
    {
      fn: "test4",
      btnname: "test",
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

  chatcontainer.style =
    "display:flex; flex-direction: column; height: 100%; width: 100%;";

  chathistory.style =
    "height: inherit; padding-top: 1%; overflow: scroll; display: flex; flex-direction: column;";

  messageinput.rows = 1;
  messageinput.style =
    "width: 90%; margin-left: 2.5%; font-size: 140%; padding-top: 2.5%; border: 2px solid #000;";
  sendbtn.innerText = "Send";
  sendbtn.setAttribute("onclick", "sendMessageToAi()");
  sendbtn.style = "height: 100%;";
  messageinputdiv.style =
    "display: flex; margin-bottom: 0.2%; margin-left: 0.1%; margin-right: 0.1%;";

  messageinputdiv.appendChild(messageinput);
  messageinputdiv.appendChild(sendbtn);

  chatcontainer.appendChild(chathistory);
  chatcontainer.appendChild(messageinputdiv);
  content.appendChild(chatcontainer);

  const sidebarbtnscontent = [
    {
      fn: "test",
      btnname: "test",
    },
    {
      fn: "isElementVisible()",
      btnname: "test Visible",
    },
    {
      fn: "test3",
      btnname: "test",
    },
    {
      fn: "test4",
      btnname: "test",
    },
  ];
  openWindow("AI Chat(Gemini)", content, sidebarbtnscontent);
  if (
    chathistorylist.length === 0 ||
    chathistorylist[chathistorylist.length - 1].chatsfinished === false
  ) {
    reqChatHistory(-1);
  } else {
    addChatListToChatHistory();
  }
}
var xhttpchatrequest = new XMLHttpRequest();
function reqChatHistory(lastreceivedid) {
  if (xhttpchatrequest.readyState === 0 || xhttpchatrequest.readyState === 4) {
    xhttpchatrequest.open("POST", "/aichathistoryrequest", true);
    xhttpchatrequest.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded",
    );
    xhttpchatrequest.send(
      "username=" + getCookie("username") + "&lastreceivedid=" + lastreceivedid,
    );
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
  const msg =
    document.querySelector(".windowbody").children[0].children[0].children[1]
      .children[0].value;
  console.log(msg);
  addUserMsgToOutput(msg);
  if (xhttpmsgsubmit.readyState === 0 || xhttpmsgsubmit.readyState === 4) {
    xhttpmsgsubmit.open("POST", "/aichatmsgsubmit", true);
    xhttpmsgsubmit.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded",
    );
    xhttpmsgsubmit.send(
      "username=" +
      getCookie("username") +
      "&message=" +
      msg +
      "&date=" +
      curr_date +
      "&time=" +
      curr_time,
    );
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
  const chathistory =
    document.querySelector(".windowbody").children[0].children[0].children[0];
  if (singlechat.chatfound === true) {
    if (singlechat.chatinitby === "user") {
      chathistory.insertBefore(
        aiMsgBubble(singlechat.aimsg),
        chathistory.firstChild,
      );
      chathistory.insertBefore(
        userMsgBubble(singlechat.usermsg),
        chathistory.firstChild,
      );
    }
    reqChatHistory(singlechat.chatid);
  } else if (singlechat.chatsfinished === true) {
    scrollToElement(chathistory.children[chathistory.children.length - 1]);
  }
  chathistorylist.push(singlechat);
}
function addChatListToChatHistory() {
  const chathistory =
    document.querySelector(".windowbody").children[0].children[0].children[0];
  for (let i = 0; i < chathistorylist.length - 1; i++) {
    if (chathistorylist[i].chatinitby === "user") {
      chathistory.insertBefore(
        aiMsgBubble(chathistorylist[i].aimsg),
        chathistory.firstChild,
      );
      chathistory.insertBefore(
        userMsgBubble(chathistorylist[i].usermsg),
        chathistory.firstChild,
      );
    } else {
      chathistory.insertBefore(
        userMsgBubble(chathistorylist[i].usermsg),
        chathistory.firstChild,
      );
      chathistory.insertBefore(
        aiMsgBubble(chathistorylist[i].aimsg),
        chathistory.firstChild,
      );
    }
  }
  scrollToElement(chathistory.children[chathistory.children.length - 1]);
}
function addUserMsgToOutput(msgtoadd) {
  const msgfield =
    document.querySelector(".windowbody").children[0].children[0].children[1]
      .children[0];
  const sendbtn =
    document.querySelector(".windowbody").children[0].children[0].children[1]
      .children[1];
  msgfield.value = "";
  msgfield.setAttribute("disabled", "true");
  sendbtn.setAttribute("disabled", "true");
  const chathistory =
    document.querySelector(".windowbody").children[0].children[0].children[0];

  chathistory.appendChild(userMsgBubble(msgtoadd));
  scrollToElement(chathistory.children[chathistory.children.length - 1]);
}
function addAIMsgToOutput(msgtoadd) {
  const msgfield =
    document.querySelector(".windowbody").children[0].children[0].children[1]
      .children[0];
  const sendbtn =
    document.querySelector(".windowbody").children[0].children[0].children[1]
      .children[1];
  msgfield.removeAttribute("disabled");
  sendbtn.removeAttribute("disabled");
  const chathistory =
    document.querySelector(".windowbody").children[0].children[0].children[0];

  chathistory.appendChild(aiMsgBubble(msgtoadd));
  scrollToElement(chathistory.children[chathistory.children.length - 1]);
}

const upcomingeventslist = [];
function openEvents() {
  const content = document.createElement("div");
  const sidebarbtnscontent = [
    {
      fn: "sortEvents();",
      btnname: "Sort",
    },
    {
      fn: "makeEventsSelectable()",
      btnname: "Select",
    },
    {
      fn: "selectAllEvents()",
      btnname: "Select All",
    },
    {
      fn: "showeventpopup('addanevent','showeventwindow');",
      btnname: "Add",
    },
  ];
  openWindow("Events", content, sidebarbtnscontent);
  if (upcomingeventslist.length === 0) {
    startTopBarAnimation(null);
    findandsetcurrdate_time();
    reqUpcomingEvents(curr_date, curr_time, updateUpcomingEventsListOutput);
  } else {
    printUpcomingEventsList();
  }
}
function printUpcomingEventsList() {
  const events = document.getElementsByClassName("windowbody")[0].children[0];
  events.innerHTML = "";
  console.log(upcomingeventslist.length);
  console.log(upcomingeventslist);
  if (upcomingeventslist.length === 0) {
    events.innerHTML = "<h1 style=\"display: flex; justify-content: center; align-items: center; margin: 0; height: 100%; font-size: xxx-large;\">There isn't any upcoming events!</h1>";
    return;
  }
  for (let i = 0; i < upcomingeventslist.length; i++) {
    events.appendChild(upcomingeventslist[i].ashtml);
  }
  if (events.children[0].children.length === 3) {
    makeEventsUnselectable();
  }
}

const upcomingeventsrequest = new XMLHttpRequest();
function reqUpcomingEvents(currdate, currtime, UpdateUI) {
  if (upcomingeventsrequest.readyState === 0 || upcomingeventsrequest.readyState === 4) {
    upcomingeventsrequest.open("POST", "/upcomingeventrequest", true);
    upcomingeventsrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    upcomingeventsrequest.send("username=" + getCookie("username") + "&currentdate=" + currdate + "&currenttime=" + currtime);
  }
  upcomingeventsrequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(upcomingeventsrequest.response);
      if (res.eventsfound === true) {
        for (let i = 0; i < res.events.length; i++) {
          upcomingeventslist.push({ ashtml: "", asjson: res.events[i] });
        }
        UpdateUI();
      } else {
        UpdateUI();
      }
      stopTopBarAnimation(null);
    }
  };
}
function updateUpcomingEventsListOutput() {
  if (upcomingeventslist.length === 0) {
    printUpcomingEventsList();
  }
  const wbody = document.getElementsByClassName("windowbody")[0];
  for (let i = 0; i < upcomingeventslist.length; i++) {
    wbody.children[0].appendChild(createEventCard(upcomingeventslist[i]));
  }
}
function createEventCard(eventdata) {
  const eventcard = document.createElement("div");
  const edatetimeinfo = document.createElement("div");
  const eventinfo = document.createElement("div");
  const ename = document.createElement("h4");
  const edescription = document.createElement("p");

  const datetime = new Date(eventdata.asjson.datetime.slice(0, -1));
  const edate = formatDate(
    datetime.getDate(),
    datetime.getMonth() + 1,
    datetime.getFullYear(),
  );
  const etime =
    formatTime(datetime.getHours(), datetime.getMinutes(), 12) +
    " " +
    findAmPm(datetime.getHours());

  edatetimeinfo.innerHTML = edate + "<br>" + etime;
  edatetimeinfo.style =
    "margin-right: 1%; margin-left: 1%; align-self: center;";
  ename.innerText = eventdata.asjson.name;
  ename.style = "border-bottom: 1.5px solid #000; margin: 0; padding-left: 2%; font-size: 200%;";
  if (eventdata.asjson.description !== "") {
    edescription.innerText = eventdata.asjson.description;
    edescription.style = "padding-left: 2%; margin-top: 1%; margin-bottom: 1.5%; font-size: 95%;";
  }

  eventinfo.appendChild(ename);
  eventinfo.appendChild(edescription);
  eventinfo.style =
    "border-right: 2px solid #000; background:white; display:flex; flex-direction: column; width: 100%";
  eventcard.style =
    "border-bottom: 3.5px solid #000; background:white; display:flex; flex-direction: row; justify-content:space-between;";
  eventcard.appendChild(eventinfo);
  eventcard.appendChild(edatetimeinfo);
  eventdata.ashtml = eventcard;
  return eventcard;
}
function sortEvents() {
  startTopBarAnimation(null);
  for (let i = 0; i < upcomingeventslist.length; i++) {
    for (let j = 0; j < upcomingeventslist.length - i - 1; j++) {
      const current_eventdt = getDateTimeFromCard(upcomingeventslist[j].ashtml);
      const next_eventdt = getDateTimeFromCard(
        upcomingeventslist[j + 1].ashtml,
      );
      if (current_eventdt > next_eventdt) {
        const temp = upcomingeventslist[j];
        upcomingeventslist[j] = upcomingeventslist[j + 1];
        upcomingeventslist[j + 1] = temp;
      }
    }
  }
  printUpcomingEventsList();
  stopTopBarAnimation(null);
}
function makeEventsSelectable() {
  if ((upcomingeventslist.length) <= 1 && (upcomingeventslist[0].asjson.eventsfinished === true)) {
    return;
  }
  let selectbtn_a_tag;
  let selectallbtn_a_tag;
  let addbtn_a_tag;
  if (document.getElementById("calsidebar2").children[0].children.length === 1) {
    selectbtn_a_tag = document.getElementById("calsidebar2").children[0].children[0].children[1].children[0];
    selectallbtn_a_tag = document.getElementById("calsidebar2").children[0].children[0].children[2].children[0];
    addbtn_a_tag = document.getElementById("calsidebar2").children[0].children[0].children[3].children[0];
  }
  else {
    selectbtn_a_tag = document.getElementById("calsidebar2").children[0].children[1].children[0].children[0];
    selectallbtn_a_tag = document.getElementById("calsidebar2").children[0].children[2].children[0].children[0];
    addbtn_a_tag = document.getElementById("calsidebar2").children[0].children[3].children[0].children[0];
  }
  selectbtn_a_tag.innerText = "Unselect";
  selectbtn_a_tag.href = "javascript:makeEventsUnselectable();";
  selectallbtn_a_tag.innerText = "Edit";
  selectallbtn_a_tag.href = "javascript:editSelectedEvent();";
  addbtn_a_tag.innerText = "Delete";
  addbtn_a_tag.href = "javascript:deleteSelectedEvents();";

  const events = document.getElementsByClassName("windowbody")[0].children[0];
  for (let i = 0; i < events.children.length; i++) {
    const selectbox = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.oninput = function () { toggleSelection(this); };
    checkbox.style = "height: 23px; width: 23px;"
    selectbox.appendChild(checkbox);
    selectbox.style = "align-self: stretch; display: flex; align-items: center; padding-left: 0.7%; margin-right: 1%; border-left: 2px solid black;";
    events.children[i].appendChild(selectbox);
  }
}
function makeEventsUnselectable() {
  selectedEventsAsJson.length = 0;
  const events = document.getElementsByClassName("windowbody")[0].children[0];
  for (let i = 0; i < events.children.length; i++) {
    events.children[i].removeChild(events.children[i].children[events.children[i].children.length - 1]);
  }
  let unselectbtn_a_tag;
  let editbtn_a_tag;
  let deletebtn_a_tag;
  if (document.getElementById("calsidebar2").children[0].children.length === 1) {
    unselectbtn_a_tag = document.getElementById("calsidebar2").children[0].children[0].children[1].children[0];
    editbtn_a_tag = document.getElementById("calsidebar2").children[0].children[0].children[2].children[0];
    deletebtn_a_tag = document.getElementById("calsidebar2").children[0].children[0].children[3].children[0];
  }
  else {
    unselectbtn_a_tag = document.getElementById("calsidebar2").children[0].children[1].children[0].children[0];
    editbtn_a_tag = document.getElementById("calsidebar2").children[0].children[2].children[0].children[0];
    deletebtn_a_tag = document.getElementById("calsidebar2").children[0].children[3].children[0].children[0];
  }
  unselectbtn_a_tag.innerText = "Select";
  unselectbtn_a_tag.href = "javascript:makeEventsSelectable();";
  editbtn_a_tag.innerText = "Select All";
  editbtn_a_tag.href = "javascript:selectAllEvents();";
  deletebtn_a_tag.innerText = "Add";
  deletebtn_a_tag.href = "javascript:showeventpopup('addanevent','showeventwindow');";
}
function selectAllEvents() {
  if (upcomingeventslist.length === 1) {
    return;
  }
  makeEventsSelectable();
  const events = document.getElementsByClassName("windowbody")[0].children[0];
  for (let i = 0; i < events.children.length; i++) {
    const checkbox = events.children[i].children[events.children[i].children.length - 1].children[0];
    checkbox.checked = true;
    toggleSelection(checkbox);
  }
}
const selectedEventsAsJson = [];
function toggleSelection(checkbox) {
  const eventcard = checkbox.parentNode.parentNode;
  for (let i = 0; i < upcomingeventslist.length; i++) {
    if (eventcard === upcomingeventslist[i].ashtml) {
      if (selectedEventsAsJson.length === 0) {
        selectedEventsAsJson.push(upcomingeventslist[i].asjson);
        break;
      }
      for (let j = 0; j < selectedEventsAsJson.length; j++) {
        if (selectedEventsAsJson[j] === upcomingeventslist[i].asjson) {
          deleteElementFromArray(selectedEventsAsJson, j);
          break;
        }
        else if (j === (selectedEventsAsJson.length - 1)) {
          selectedEventsAsJson.push(upcomingeventslist[i].asjson);
          break;
        }
      }
      break;
    }
  }
}
const deletedEventsAsJson = [];
function deleteSelectedEvents() {
  for (let i = 0; i < upcomingeventslist.length; i++) {
    for (let j = 0; j < selectedEventsAsJson.length; j++) {
      if (selectedEventsAsJson[j] === upcomingeventslist[i].asjson) {
        deleteElementFromArray(upcomingeventslist, i);
        deletedEventsAsJson.push(selectedEventsAsJson[j]);
        deleteElementFromArray(selectedEventsAsJson, j);
        j = j - 1;
        i = i - 1;
        break;
      }
    }
  }
  const id_todelete = deletedEventsAsJson[0].eventid_global;
  console.log(id_todelete);
  deleteElementFromArray(deletedEventsAsJson, 0);
  deleteEvent(id_todelete);
  closeWindow();
  openEvents();
}

async function deleteEvent(globaleid) {
  const deletereq = new XMLHttpRequest();
  deletereq.open("DELETE", "/deletesingleevent", true);
  deletereq.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded",
  );
  deletereq.send("username=" + getCookie("username") + "&globalidtodelete=" + globaleid);
  deletereq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(deletereq.response);
      if ((res.deleted === true) && (deletedEventsAsJson.length > 0)) {
        const id_todelete = deletedEventsAsJson[0].eventid_global;
        deleteElementFromArray(deletedEventsAsJson, 0);
        deleteEvent(id_todelete);
      }
      console.log(res);
    }
  };
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



function openShortcuts() {
  const content = document.createElement("div");
  content.style = "display: flex; justify-content: space-between;";
  getShortcuts(content);
  const sidebarbtnscontent = [
    {
      fn: "openShortcutAdder()",
      btnname: "Add",
    },
    {
      fn: "test2",
      btnname: "test",
    },
    {
      fn: "test3",
      btnname: "test",
    },
    {
      fn: "test4",
      btnname: "test",
    },
  ];
  openWindow("Shortcuts", content, sidebarbtnscontent);
}

let sclist = [];
let orderedsclist = [];
function getShortcuts(content) {
  orderedsclist = [];
  if (sclist.length === 0) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.slice(0, 3) === "sc_") {
        sclist.push(key.slice(3, key.length));
      }
    }
    if (sclist.length === 0) {
      getShortcutsFromServer(0, content);
    } else {
      //build shortcut buttons to display
      for (let i = 0; i < sclist.length; i++) {
        let scalreadyadded = false;
        console.log(sclist[i]);
        const sc = sclist[i].split("_");
        for (let check = 0; check < orderedsclist.length; check++) {
          if (orderedsclist[check].name === sc[1]) {
            scalreadyadded = true;
            if (sc[0] === "btnname") {
              orderedsclist[check].btnname = localStorage.getItem(
                "sc_" + sclist[i],
              );
            } else if (sc[0] === "fncall") {
              orderedsclist[check].fncall = localStorage.getItem(
                "sc_" + sclist[i],
              );
            }
          }
        }
        if (scalreadyadded === false) {
          if (sc[0] === "btnname") {
            orderedsclist.push({
              name: sc[1],
              btnname: localStorage.getItem("sc_" + sclist[i]),
            });
          } else if (sc[0] === "fncall") {
            orderedsclist.push({
              name: sc[1],
              fncall: localStorage.getItem("sc_" + sclist[i]),
            });
          }
        }
      }
      buildShortcutOutput(content);
      for (let c = 0; c < orderedsclist.length; c++) {
        console.log(orderedsclist[c]);
      }
    }
  } else {
    //build shortcut buttons to display
    for (let i = 0; i < sclist.length; i++) {
      let scalreadyadded = false;
      console.log(sclist[i]);
      const sc = sclist[i].split("_");
      for (let check = 0; check < orderedsclist.length; check++) {
        if (orderedsclist[check].name === sc[1]) {
          scalreadyadded = true;
          if (sc[0] === "btnname") {
            orderedsclist[check].btnname = localStorage.getItem(
              "sc_" + sclist[i],
            );
          } else if (sc[0] === "fncall") {
            orderedsclist[check].fncall = localStorage.getItem(
              "sc_" + sclist[i],
            );
          }
        }
      }
      if (scalreadyadded === false) {
        if (sc[0] === "btnname") {
          orderedsclist.push({
            name: sc[1],
            btnname: localStorage.getItem("sc_" + sclist[i]),
          });
        } else if (sc[0] === "fncall") {
          orderedsclist.push({
            name: sc[1],
            fncall: localStorage.getItem("sc_" + sclist[i]),
          });
        }
      }
    }
    buildShortcutOutput(content);
  }
}
function buildShortcutOutput(content) {
  for (let shortcut = 0; shortcut < orderedsclist.length; shortcut++) {
    const btn = document.createElement("button");
    btn.innerText = orderedsclist[shortcut].btnname;
    btn.setAttribute("onclick", orderedsclist[shortcut].fncall);
    btn.style = "height: 50%; width: 50%; font-size: xx-large;";
    content.appendChild(btn);
  }
}

const shortcutsrequest = new XMLHttpRequest();
function getShortcutsFromServer(lastreceived_sc_id, content) {
  console.log("hello");
  if (shortcutsrequest.readyState === 0 || shortcutsrequest.readyState === 4) {
    shortcutsrequest.open("POST", "/shortcutsrequest", true);
    shortcutsrequest.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded",
    );
    shortcutsrequest.send(
      "username=" +
      getCookie("username") +
      "&lastreceived_sc_id=" +
      lastreceived_sc_id,
    );
  }
  shortcutsrequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(shortcutsrequest.response);
      if (res.shortcutsfinished === false) {
        localStorage.setItem(res.keyname, res.keyvalue);
        getShortcutsFromServer(res.shortcutid, content);
      } else {
        console.log("exiting");
        getShortcuts(content);
      }
    }
  };
}
const shortcutsubmit = new XMLHttpRequest();
function saveShortcut(name, value) {
  if (shortcutsubmit.readyState === 0 || shortcutsubmit.readyState === 4) {
    shortcutsubmit.open("POST", "/saveshortcut", true);
    shortcutsubmit.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded",
    );
    shortcutsubmit.send("username=" + getCookie("username") + "&keyname=" + name + "&keyvalue=" + value);
  }
  shortcutsrequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(shortcutsubmit.response);
      if (res.shortcutadded === true) {
        localStorage.setItem(name, value);
        getShortcuts();
      }
    }
  };
}
let calendarmode = true;
function openWindow(headingname, content, sidebarbtns) {
  calendarmode = false;
  document.getElementById("aisearchcontainer").style.zIndex = "-999";
  const table = document.getElementById("calendar");
  const datebuttonsbar = document.getElementById("calsidebar2");
  const css_devicesmall = getComputedStyle(
    document.querySelector(":root"),
  ).getPropertyValue("--devicesmall");
  if (css_devicesmall === "false") {
    datebuttonsbar.innerHTML =
      '<tr><td><a href="javascript:' +
      sidebarbtns[0].fn +
      ';">' +
      sidebarbtns[0].btnname +
      '</a></td></tr><tr><td><a href="javascript:' +
      sidebarbtns[1].fn +
      ';">' +
      sidebarbtns[1].btnname +
      '</a></td></tr><tr><td><a href="javascript:' +
      sidebarbtns[2].fn +
      ';">' +
      sidebarbtns[2].btnname +
      '</a></td></tr><tr><td><a href="javascript:' +
      sidebarbtns[3].fn +
      ';">' +
      sidebarbtns[3].btnname +
      "</a></td></tr>";
  } else {
    datebuttonsbar.innerHTML =
      '<tr><td><a href="javascript:' +
      sidebarbtns[0].fn +
      ';">' +
      sidebarbtns[0].btnname +
      '</a></td><td><a href="javascript:' +
      sidebarbtns[1].fn +
      ';">' +
      sidebarbtns[1].btnname +
      '</a></td><td><a href="javascript:' +
      sidebarbtns[2].fn +
      ';">' +
      sidebarbtns[2].btnname +
      '</a></td><td><a href="javascript:' +
      sidebarbtns[3].fn +
      ';">' +
      sidebarbtns[3].btnname +
      "</a></td></tr>";
  }
  deletetable();
  setWindowHeader(table, headingname);
  setWindowBody(table, content);
}
function closeWindow() {
  calendarmode = true;
  document.getElementById("aisearchcontainer").style.zIndex = "999";
  generateCalendarHeading();
  fillCalendar(displayed_date);
  addsidebar2content();
}
function setWindowHeader(table, headingname) {
  while (table.children.length !== 0) {
    table.removeChild(table.children[0]);
  }
  const heading = document.createElement("th");
  const title = document.createElement("p");
  const closebutton = document.createElement("button");

  heading.classList.add("calendarwindowheader");
  title.innerText = headingname;
  title.classList.add("calendarwindowheading");
  closebutton.innerHTML = "&times;";
  closebutton.classList.add("calendarwindowclosebutton");
  closebutton.onclick = function () {
    closeWindow();
  };
  heading.style =
    "width: 100%; padding-right: 0vmin; padding-left: 0vmin; border-left-width: 0px; border-right-width: 0px; border-top-width: 1px; margin-left: 0px;";

  heading.appendChild(title);
  heading.appendChild(closebutton);
  table.appendChild(heading);
}
function setWindowBody(table, content) {
  const windowbody = document.createElement("tr");
  content.style.cssText += "overflow:scroll; height: 100%; width: 100%;";
  windowbody.classList.add("windowbody");

  windowbody.appendChild(content);
  table.appendChild(windowbody);
}

function userMsgBubble(msg) {
  const msgbubble = document.createElement("div");
  msgbubble.innerText = msg;
  msgbubble.style =
    "align-self: end; border: 3px solid black; border-radius: 13px; border-top-right-radius: 0; padding: 5px; margin-right: 1%; margin-bottom: 0.5%; max-width: 70%;";
  return msgbubble;
}
function aiMsgBubble(msg) {
  const msgbubble = document.createElement("div");
  msgbubble.innerText = msg;
  msgbubble.style =
    "align-self: start; border: 3px solid black; border-radius: 13px; border-top-left-radius: 0; padding: 5px; margin-left: 1%; margin-bottom: 0.5%; max-width: 70%;";
  return msgbubble;
}

function isElementVisible(
  element = document.getElementsByClassName("windowbody")[0].children[0]
    .children[0].children[0].children[0],
  partiallyVisible = false,
) {
  const { top, left, bottom, right } = element.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  console.log(
    partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
      ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth,
  );
}
function scrollToElement(element) {
  element.scrollIntoView(true);
}
