/*class calendarState {
    constructor() {
        this.static = false;
        this.previousChangeID = 1;
        this.currentChangeID = 1;
        this.observe();
    }

    async observe() {
        while (true) {
            await delay(2000);
            if (this.previousChangeID === this.currentChangeID) {
                this.previousChangeID = 1;
                this.currentChangeID = 1;
                this.declareAsStatic();
            }
            else {
                this.previousChangeID = this.currentChangeID;
                this.declareAsDynamic();
            }
        }
    }
    declareAsStatic() {
        this.static = true;
        fillCalendar(displayed_date);
    }
    declareAsDynamic() {
        this.static = false;
    }
    notifyChange() {
        console.log("Change noticed!");
        this.currentChangeID = (this.currentChangeID + 1);
    }
}

let calendar_state;*/



function addalastrow() {
    const table = document.getElementById('calendar');
    const tr = document.createElement('tr');
    // Add 7 empty cells
    for (let i = 0; i < 7; i++) {
        const cell = document.createElement('td');
        cell.textContent = "";
        tr.appendChild(cell);
    }
    table.appendChild(tr);
}
function addaemptyrow() {
    const table = document.getElementById('calendar');
    const tr = document.createElement('tr');
    table.appendChild(tr);
}
function removelastrow() {
    const table = document.getElementById('calendar');
    const rows = table.querySelectorAll('tr');
    if (rows.length > 1) {
        rows[rows.length - 1].parentNode.removeChild(rows[rows.length - 1]);
    }
}
function deletetable() {
    const table = document.getElementById('calendar');
    const rows = table.querySelectorAll('tr');
    rows.forEach(() => {
        removelastrow();
    });
}


function goToDate() {
    const inputfields = document.getElementById("datepicker").querySelectorAll("input");
    let monthind;
    for (const [index, month] of months.entries()) {
        /*if (month.full === inputfields[1].value) {
            monthind = index;
        }*/

        if (month.matchesSomehow(inputfields[1].value)) {
            monthind = index;
        }
    }
    let year = inputfields[2].value;
    let date = inputfields[0].value;
    updatedate(year, monthind, date);
}
let updatingdate = false;
function updatedate(year, monthindex, date) {
    updatingdate = true;
    //calendar_state.notifyChange();
    if ((year === null || year === undefined) && (monthindex === null || monthindex === undefined) && (date === null || date === undefined)) {
        console.log("Date info to update towards is either null or undefined; proceeding to update to current date!");
        year = new Date().getFullYear();
        monthindex = new Date().getMonth();
        date = new Date().getDate();
    }
    console.log("Y:" + year + "M:" + monthindex + "D:" + date);
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
        if (!calendarmode) {
            displayed_date = newdate
        }
        else {
            fillCalendar(newdate);
            addsidebarscontent();
        }
    }
    else {
        console.log("good_date: " + good_date);
    }
    updatingdate = false;
}

function fillCalendar(cdate) {
    calendarmode = true;
    deletetable();
    for (let i = 0; i < weekscount(cdate); i++) {
        addalastrow();
    }
    displayed_date = cdate;
    console.log(displayed_date.toISOString());

    const year = cdate.getFullYear();
    const month = cdate.getMonth();
    const firstday = new Date(year, month, 1).getDay();
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD');
    let datecount = 0;
    for (const [index, cell] of cells.entries()) {
        if (index === (firstday + datecount)) {
            datecount++;
            cell.textContent = datecount;
            cell.innerHTML = "<div class=\"specialdaynotificationdiv\">&nbsp;</div>" + cell.innerHTML + "<div class=\"eventnotificationdiv\"></div>";
            cell.onclick = function () { showeventpopup(this, "showmonthcalendar"); };
            if (datecount === cdate.getDate()) {
                cell.style.border = "4px solid #00b643";
            }
            if (cdate.getFullYear() === new Date().getFullYear()) {
                if (cdate.getMonth() === new Date().getMonth()) {
                    if (datecount === new Date().getDate()) {
                        cell.style.backgroundColor = "#d9d9d9";
                    }
                }
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
    addNotificationSquares();
    addHolidays();
}


let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1, Math.floor(0.01 * (pageWidth)));
let calendartouchstartX = 0;
let calendartouchstartY = 0;
let calendartouchendX = 0;
let calendartouchendY = 0;
const limit = Math.tan(45 * 1.5 / 180 * Math.PI);

function handleGesture() {
    if (!calendarmode) {
        return;
    }
    const { width, height } = document.getElementById("calendar").getBoundingClientRect();

    const ratio_horizontal = (calendartouchendX - calendartouchstartX) / width;
    const ratio_vertical = (calendartouchendY - calendartouchstartY) / height;

    console.log(ratio_horizontal);
    console.log(ratio_vertical);
    if (ratio_horizontal > ratio_vertical && ratio_horizontal > 0.14) {
        console.log('swipe-right');
    }
    else if (ratio_horizontal < ratio_vertical && ratio_horizontal < (-0.14)) {
        console.log('swipe-left');
    }
    else if (ratio_vertical > ratio_horizontal && ratio_vertical > 0.10) {
        console.log('swipe-down');
        decrementMonthDisplay();
    }
    else if (ratio_vertical < ratio_horizontal && ratio_vertical < (-0.10)) {
        console.log('swipe-up');
        incrementMonthDisplay();
    }

    /*let x = calendartouchendX - calendartouchstartX;
    let y = calendartouchendY - calendartouchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (xy <= limit) {
            if (y < 0) {
                console.log("swipe down to up");
                incrementMonthDisplay();
            } else {
                console.log("swipe up to down");
                decrementMonthDisplay();
            }
        }
        if (yx <= limit) {
            if (x < 0) {
                console.log("swipe right to left");
            } else {
                console.log("swipe left to right");
            }
        }
    } else {
        console.log("tap");
    }*/
}
function incrementMonthDisplay() {
    if (updatingdate) {
        return;
    }
    if (displayed_date.getMonth() === 11) {
        updatedate((displayed_date.getFullYear() + 1), 0, 1);
    }
    else {
        updatedate(displayed_date.getFullYear(), (displayed_date.getMonth() + 1), 1);
    }
}
function decrementMonthDisplay() {
    if (updatingdate) {
        return;
    }
    if (displayed_date.getMonth() === 0) {
        updatedate((displayed_date.getFullYear() - 1), 11, 1);
    }
    else {
        updatedate(displayed_date.getFullYear(), (displayed_date.getMonth() - 1), 1);
    }
}

function addNotificationSquares() {
    if (upcomingeventslist.length === 0) {
        startTopBarAnimation(null);
        findandsetcurrdate_time();
        reqUpcomingEvents(curr_date, curr_time, updateEventNotificationSquare);
    }
    else {
        printUpcomingNotificationSquares();
    }
}

function updateEventNotificationSquare() {
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD');

    for (let i = 0; i < upcomingeventslist.length; i++) {
        const datetimeofevent = new Date(upcomingeventslist[i].asjson.datetime.slice(0, -1));
        if ((new Date(displayed_date).getMonth() === datetimeofevent.getMonth()) && (new Date(displayed_date).getFullYear() === datetimeofevent.getFullYear())) {
            for (const [index, cell] of cells.entries()) {
                if ((Number(cell.textContent) === datetimeofevent.getDate()) && (cell.children[1].children.length < 4)) {
                    const clr = upcomingeventslist[i].asjson.color;
                    let clralreadyset = false;
                    for (let j = 0; j < cell.children[1].children.length; j++) {
                        if (hextorgb(clr) === cell.children[1].children[j].style.backgroundColor) {
                            clralreadyset = true;
                            break;
                        }
                    }
                    if (clralreadyset === false) {
                        const square = document.createElement("div");
                        square.style.backgroundColor = clr;
                        square.classList.add("eventnotifactionsquare");
                        cell.children[1].appendChild(square);
                    }
                }
            }
        }
        createEventCard(upcomingeventslist[i]);
    }
}

function printUpcomingNotificationSquares() {
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD');
    for (let i = 0; i < upcomingeventslist.length; i++) {
        const datetimeofevent = new Date(upcomingeventslist[i].asjson.datetime.slice(0, -1));
        if ((new Date(displayed_date).getMonth() === datetimeofevent.getMonth()) && (new Date(displayed_date).getFullYear() === datetimeofevent.getFullYear())) {
            const clr = upcomingeventslist[i].asjson.color;
            for (const [index, cell] of cells.entries()) {
                if ((Number(cell.textContent) === datetimeofevent.getDate()) && (cell.children[1].children.length < 4)) {
                    let clralreadyset = false;
                    for (let j = 0; j < cell.children[1].children.length; j++) {
                        if (hextorgb(clr) === cell.children[1].children[j].style.backgroundColor) {
                            clralreadyset = true;
                            break;
                        }
                    }
                    if (clralreadyset === false) {
                        const square = document.createElement("div");
                        square.style.backgroundColor = clr;
                        square.classList.add("eventnotifactionsquare");
                        cell.children[1].appendChild(square);
                    }
                }
            }
        }
    }
}

let holidayslist = [];
let holidayssetforyear = null;
function addHolidays() {
    if ((holidayslist.length === 0) || (holidayssetforyear !== displayed_date.getFullYear()))/* && (calendar_state.static === true))*/ {
        reqHolidaysFromServer(displayed_date.getFullYear());
    }
    else if (holidayssetforyear === displayed_date.getFullYear()) {
        const holidaysofthismonth = getSingleMonthHolidays(displayed_date.getMonth());
        const table = document.getElementById('calendar');
        const cells = table.querySelectorAll('TD');
        for (const [index, cell] of cells.entries()) {
            for (let i = 0; i < holidaysofthismonth.length; i++) {
                if (Number(cell.textContent) === new Date(holidaysofthismonth[i].date).getDate()) {
                    const specialdaynotification = document.createElement("span");
                    specialdaynotification.classList.add("specialdaynotificationspan");
                    specialdaynotification.innerHTML = holidaysofthismonth[i].name;
                    cell.children[0].appendChild(specialdaynotification);
                    const top = parseFloat(window.getComputedStyle(cell.children[0]).getPropertyValue("top").split("px")[0]);
                    const left = parseFloat(window.getComputedStyle(cell.children[0]).getPropertyValue("left").split("px")[0]);
                    cell.children[0].style.top = (top - 15) + "px";
                    cell.children[0].style.left = (left - 5) + "px";
                    break;
                }
            }
        }
    }
}
const holidayrequest = new XMLHttpRequest();
function reqHolidaysFromServer(vyear) {
    holidayslist = [];
    holidayssetforyear = null;
    if (holidayrequest.readyState === 0 || holidayrequest.readyState === 4) {
        holidayrequest.open("POST", "/fetchspecialdays", true);
        holidayrequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        holidayrequest.send("region=" + "indian" + "&viewingyear=" + vyear);
    }
    holidayrequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            holidayslist = JSON.parse(holidayrequest.response);
            if (holidayslist.length !== 0) {
                holidayssetforyear = vyear;
                addHolidays();
            }
            console.log(holidayslist);
        };
    }
}
function getSingleMonthHolidays(monthindex) {
    let selectedholidays = [];
    for (let i = 0; i < holidayslist.length; i++) {
        if (new Date(holidayslist[i].date).getMonth() === monthindex) {
            selectedholidays.push(holidayslist[i]);
        }
    }
    return selectedholidays;
}
function getSingleDateHolidays(date, monthindex) {
    let selectedholidays = [];
    for (let i = 0; i < holidayslist.length; i++) {
        const d = new Date(holidayslist[i].date);
        if ((d.getDate() === date) && (d.getMonth() === monthindex)) {
            selectedholidays.push(holidayslist[i]);
        }
    }
    return selectedholidays;
}






let incompletesuggestion = "";
let alreadysuggesting = false;
let streamfinished = true;
async function suggestSearch() {
    if (document.getElementById("searchsuggestionsdiv") !== null) {
        document.getElementById("searchsuggestionsdiv").innerHTML = "";
    }
    const c_length = document.getElementById("aisearchinput").value.length;
    await delay(800);
    if (c_length !== document.getElementById("aisearchinput").value.length) {
        console.log("Will not request search suggestion");
        return;
    }
    const partialsearch = document.getElementById("aisearchinput").value;
    let suggestionsdiv = document.getElementById("searchsuggestionsdiv");
    if (partialsearch.length === 0) {
        if (suggestionsdiv !== null) {
            closeSuggestionsDiv();
        }
    }
    else if (alreadysuggesting === false) {
        if (suggestionsdiv === null) {
            suggestionsdiv = openSuggestionsDiv();
        }
        (async () => {
            alreadysuggesting = true;
            streamfinished = false;
            const request = new Request("http://192.168.156.40:3000/aisearchsuggest?partiallysearched=" + partialsearch, {
                method: "GET"
            });
            //const suggestionsdiv = document.getElementById("searchsuggestionsdiv");
            suggestionsdiv.innerHTML = "";
            for await (let chunk of streamingFetch(() => fetch(request))) {
                //console.log(chunk);
                for (let i = 0; i < chunk.length; i++) {
                    if (chunk[i] !== ";") {
                        incompletesuggestion = incompletesuggestion + chunk[i];
                    }
                    else if (chunk[i] === ";") {
                        const suggestion = document.createElement("div");
                        suggestion.innerText = incompletesuggestion;
                        suggestionsdiv.appendChild(suggestion);
                        incompletesuggestion = "";
                    }
                    if ((chunk[i] === ";") && (chunk[i + 1] === ";")) {
                        streamfinished = true;
                        break;
                    }
                }
                if (streamfinished === true) {
                    break;
                }
            }
            alreadysuggesting = false;
        })();
    }
}
function openSuggestionsDiv() {
    if (document.getElementById("searchsuggestionsdiv") === null) {
        const div = document.createElement("div");
        div.id = "searchsuggestionsdiv";
        document.getElementById("aisearchcontainer").appendChild(div);
        return div;
    }
    return document.getElementById("searchsuggestionsdiv");
}
function closeSuggestionsDiv() {
    openSuggestionsDiv().innerHTML = "";
    document.getElementById("aisearchcontainer").removeChild(openSuggestionsDiv());
}

async function* streamingFetch(fetchcall) {

    const response = await fetchcall();
    // Attach Reader
    const reader = response.body.getReader();
    while (true) {
        // wait for next encoded chunk
        const { done, value } = await reader.read();
        // check if stream is done
        if (done) break;
        // Decodes data chunk and yields it
        yield (new TextDecoder().decode(value));
    }
}
