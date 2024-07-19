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
        if (month.full === inputfields[1].value) {
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
        addsidebarscontent();
    }
    else {
        console.log("good_date: " + good_date);
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
    const cells = table.querySelectorAll('TD');
    let datecount = 0;
    for (const [index, cell] of cells.entries()) {
        if (index === (firstday + datecount)) {
            datecount++;
            cell.textContent = datecount;
            cell.innerHTML = cell.innerHTML + "<div class=\"eventnotificationdiv\"></div>";
            cell.onclick = function () { showeventpopup(this); };
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
}

function addNotificationSquares() {
    if (upcomingeventslist.length === 0) {
        startTopBarAnimation(null);
        findandsetcurrdate_time();
        reqUpcomingEvent(curr_date, curr_time, 0, updateEventNotificationSquare);
    }
    else if (upcomingeventslist[upcomingeventslist.length - 1].asjson.eventsfinished === true) {
        printUpcomingNotificationSquares();
        console.log("hello");
    }
}

function updateEventNotificationSquare() {
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD');
    if (upcomingeventslist[upcomingeventslist.length - 1].asjson.eventfound === true) {
        const datetimeofevent = new Date(upcomingeventslist[upcomingeventslist.length - 1].asjson.datetime.slice(0, -1));
        if ((new Date(displayed_date).getMonth() === datetimeofevent.getMonth()) && (new Date(displayed_date).getFullYear() === datetimeofevent.getFullYear())) {
            for (const [index, cell] of cells.entries()) {
                if ((Number(cell.textContent) === datetimeofevent.getDate()) && (cell.children[0].children.length < 4)) {
                    const clr = upcomingeventslist[upcomingeventslist.length - 1].asjson.color;
                    let clralreadyset = false;
                    for (let j = 0; j < cell.children[0].children.length; j++) {
                        if (hextorgb(clr) === cell.children[0].children[j].style.backgroundColor) {
                            clralreadyset = true;
                        }
                    }
                    if (clralreadyset === false) {
                        const square = document.createElement("div");
                        square.style.backgroundColor = clr;
                        square.classList.add("eventnotifactionsquare");
                        cell.children[0].appendChild(square);
                    }
                }
            }
        }
        createEventCard(upcomingeventslist[upcomingeventslist.length - 1]);
        const id = upcomingeventslist[upcomingeventslist.length - 1].asjson.eventid;
        reqUpcomingEvent(curr_date, curr_time, id, updateEventNotificationSquare);
    }
}

function printUpcomingNotificationSquares() {
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD');
    for (let i = 0; i < upcomingeventslist.length - 1; i++) {
        const datetimeofevent = new Date(upcomingeventslist[i].asjson.datetime.slice(0, -1));
        if ((new Date(displayed_date).getMonth() === datetimeofevent.getMonth()) && (new Date(displayed_date).getFullYear() === datetimeofevent.getFullYear())) {
            const clr = upcomingeventslist[i].asjson.color;
            for (const [index, cell] of cells.entries()) {
                if ((Number(cell.textContent) === datetimeofevent.getDate()) && (cell.children[0].children.length < 4)) {
                    let clralreadyset = false;
                    for (let j = 0; j < cell.children[0].children.length; j++) {
                        if (hextorgb(clr) === cell.children[0].children[j].style.backgroundColor) {
                            clralreadyset = true;
                        }
                    }
                    if (clralreadyset === false) {
                        const square = document.createElement("div");
                        square.style.backgroundColor = clr;
                        square.classList.add("eventnotifactionsquare");
                        cell.children[0].appendChild(square);
                    }
                }
            }
        }
    }
}



let incompletesuggestion = "";
let alreadysuggesting = false;
let streamfinished = true;
async function suggestSearch() {
    if(document.getElementById("searchsuggestionsdiv") !== null) {
        document.getElementById("searchsuggestionsdiv").innerHTML = "";
    }
    const c_length = document.getElementById("aisearchinput").value.length;
    await delay(800);
    if(c_length !== document.getElementById("aisearchinput").value.length) {
        console.log("Will not request");
        return;
    }
    console.log("Requesting...");
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
    measureofchange = 0;
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


