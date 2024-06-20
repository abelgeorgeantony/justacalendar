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
function showeventpopup(element) {
    console.log(element);
    let clickeddate = displayed_date.getFullYear();
    if (displayed_date.getMonth() < 9) {
        clickeddate = clickeddate+"-0"+(displayed_date.getMonth() + 1);
    }
    else {
        clickeddate = clickeddate+"-"+(displayed_date.getMonth() + 1);
    }
    if (Number(element.textContent) < 10) {
        clickeddate = clickeddate+"-0"+element.textContent;
    }
    else {
        clickeddate = clickeddate+"-"+element.textContent;
    }
    console.log(clickeddate);
    document.getElementById("edate").value = clickeddate;
    dragPopUp(document.getElementById("eventpopup"));
    document.getElementById("eventpopupcontainer").style.zIndex = "9";
}
function hideeventpopup() {
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