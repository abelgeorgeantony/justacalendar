let displayed_date = new Date();


function loadTable(authenticated) {
    if (authenticated === true) {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "4.5vw");
        const currentdate = new Date();
        generateCalendarHeading();
        fillCalendar(currentdate);
        addsidebarscontent();
    }
    else {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "5.2vw");
        generateWelcomeCalendar();
    }
}
function generateCalendarHeading() {
    deletetable();
    const table = document.getElementById('calendar');
    table.innerHTML = "";
    let tr = document.createElement('tr');
    for (const day of days) {
        const th = document.createElement('th');
        th.innerHTML = "";
        th.textContent = day.short;
        tr.appendChild(th);
    }
    table.appendChild(tr);
}

async function generateWelcomeCalendar() {
    const table = document.getElementById('calendar');
    generateCalendarHeading();

    const innhtml = [
        "<a href=\"javascript:toggleScrambling();\" id=\"stopanimationbtn\">&#10073;&nbsp;&#10073;</a>",
        "<a href=\"/about\" style=\"text-decoration: none;\">About</a>",
        "<a href=\"/signup\" style=\"text-decoration: none;\">Sign Up</a>",
        "<a href=\"/login\" style=\"text-decoration: none;\">Log In</a>"
    ];
    const t_headings = table.querySelectorAll('TH');
    for (const [index, t_heading] of t_headings.entries()) {
        if (index !== 0) {
            t_heading.innerHTML = innhtml[index];
            t_heading.setAttribute("colspan", "2");
        }
        else {
            t_heading.innerHTML = innhtml[index];
            t_heading.colspan = "1";
        }
    }
    table.children[0].removeChild(table.children[0].children[table.children[0].children.length - 1]);
    table.children[0].removeChild(table.children[0].children[table.children[0].children.length - 1]);
    table.children[0].removeChild(table.children[0].children[table.children[0].children.length - 1]);

    setWelcomeMessage();
    await delay(1555);
    animateWelcomeMessage();
}

function setWelcomeMessage() {
    for (let week = 0; week < 4; week++) {
        addalastrow();
    }
    const table = document.getElementById('calendar');
    const msg = [
        "W", "E", "L", "C", "O", "M", "E",
        "", "", "", "TO", "", "", "",
        "J", "U", "S", "T", "A", "C", "A",
        "L", "E", "N", "D", "A", "R", "!"
    ];
    const cells = table.querySelectorAll('TD');
    for (const [index, cell] of cells.entries()) {
        if (msg[index] != "") {
            cell.textContent = msg[index]; // Adding a Welcome message!
            let weight = (index+1);
            if (msg[index] === 'J' || msg[index] === 'U' || msg[index] === 'S' || msg[index] === 'T') {
                cell.style.backgroundColor = "#1DB514";
                cell.id = weight;
            }
            else if (index === 18 && msg[index] === 'A') {
                cell.style.backgroundColor = "#8A8A8A";
                cell.style.color = "white";
                cell.id = weight;
            }
            else if (index > 18 && index < 27) {
                cell.style.backgroundColor = "#ff0028";
                cell.id = weight;
            }
            else {
                cell.style.backgroundColor = "#393CFC";
                cell.style.color = "white";
                cell.id = weight;
            }
        }
        else {
            cell.textContent = "";
            cell.style.backgroundColor = "white";
            cell.id = 0;
        }
    }
}


function addsidebarscontent() {
    document.getElementById("aisearchcontainer").style.zIndex = "999";
    addsidebar1content();
    addsidebar2content();
}


