class myname {
    constructor(fulln) {
        this.fullname = fulln;
        this.shortname = this.reducename(3);
    }
    reducename(length) {
        if(length === (this.fullname.length-1)) {
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
        generateMonthStructure(weekscount(currentdate));
        fillCalendar(currentdate);
        addsidebarcontent();
        //showdatepicker();
        hidedatepicker();
    }
    else {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "2.5vw");
        generateWelcomeCalendar();
    }
}
function generateMonthStructure(weeks) {
    deletetable();
    const table = document.getElementById('calendar');
    let tr = document.createElement('tr'); // Create table header row
    for (const day of days) {
        const th = document.createElement('th');
        th.innerHTML = "";
        th.textContent = day.shortname;
        tr.appendChild(th);
    }
    table.appendChild(tr); // Add header row to table

    for (let week = 0; week < weeks; week++) {
        addalastrow();
    }
    //styleCalendar();
}

function generateWelcomeCalendar() {
    const table = document.getElementById('calendar');
    generateMonthStructure(4);

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
    tr = document.createElement('tr'); // Create new table row
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

function showdatepicker() {
    const inputfields = document.getElementById("datepicker").querySelectorAll("input");
    inputfields[0].value = displayed_date.getDate();
    inputfields[1].value = months[displayed_date.getMonth()].fullname;
    inputfields[2].value = displayed_date.getFullYear();
    dragElement(document.getElementById("datepicker"));
    document.getElementById("datepickercontainer").style.zIndex = "9";
}
function hidedatepicker() {
    document.getElementById("datepickercontainer").style.zIndex = "-1";
}
function addsidebarcontent() {
    const sidebar = document.getElementById('calsidebar');
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
                cell.innerHTML = "<a href=\"javascript:removelastrow();\">" + cellcontent[i] + "</a>";
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
                cell.innerHTML = "<a href=\"javascript:removelastrow();\">" + cellcontent[i] + "</a>";
            }
            tr.appendChild(cell);
        }
        sidebar.appendChild(tr);
    }
}

function dragElement(elmnt) {
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


function fillCalendar(cdate) {
    displayed_date = cdate;
    const year = cdate.getFullYear();
    const month = cdate.getMonth();
    const firstday = new Date(year, month, 1).getDay();
    const table = document.getElementById('calendar');
    const cells = table.querySelectorAll('TD'); // assigning td to cells
    let datecount = 0;
    //let monthlcount = 0;
    for (const [index, cell] of cells.entries()) {
        if (index === (firstday + datecount)) {
            datecount++;
            cell.textContent = datecount;
            if (datecount === cdate.getDate()) {
                cell.style.backgroundColor = "silver";
            }
        }
        /*else {
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
            if (isLeap(t.getFullYear())) {
                if (datecount === 29) {
                    datecount = 0;
                    //return;
                }
            }
            else {
                if (datecount === 28) {
                    datecount = 0;
                    //return;
                }
            }
        }
        else if (month === 3 || month === 5 || month === 8 || month === 10) {
            if (datecount === 30) {
                datecount = 0;
                //return;
            }
        }
        else {
            if (datecount === 31) {
                datecount = 0;
                //return;
            }
        }
    }
}

function weekscount(dateobj) {
    /*
    31 month:
        1st day == 0 to 4 => 5weeks
        1st day == 5 to 6 => 6weeks
    30 month:
        1st day == 0 to 5 => 5weeks
        1st day == 6 => 6weeks
    29 month:
        1st day == 0 to 6 => 5weeks
    28 month:
        1st day == 0 => 4weeks
        1st day == 1 to 6 => 5weeks
    */
    let month = dateobj.getMonth();
    let firstday = new Date(dateobj.getFullYear(), dateobj.getMonth(), 1).getDay();
    if (month === 1) { //february
        if (isLeap(t.getFullYear())) {
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