let displayed_date = new Date();


function loadTable(authenticated) {
    //localStorage.clear();
    if (authenticated === true) {
        document.querySelector(":root").style.setProperty("--smalldevicethsize", "4.5vw");
        //calendar_state = new calendarState();
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
        "<a href=\"javascript:toggleAbout();\" style=\"text-decoration: none;\">About</a>",
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
            let weight = (index + 1);
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
                cell.style.backgroundColor = "#0000de";
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

function toggleAbout() {
    if (document.getElementById("aboutcontainer") === null) {
        const aboutcontainer = document.createElement("div");
        aboutcontainer.id = "aboutcontainer";
        aboutcontainer.style = "position: fixed; height: 100vh; width: 100vw; top: 0; left: 0; z-index: 999; background-color: rgba( 0,111,177, 0.4); backdrop-filter: blur(10.9px); ";

        const topbar = document.createElement("div");
        const heading = document.createElement("h1");
        heading.innerHTML = "Just A Calendar!";
        heading.style = "font-family: \"Times New Roman\", Times, serif; font-size: xx-large; margin: 0; margin-left: 2%; align-self: center;";
        const closebutton = document.createElement("button");
        closebutton.innerHTML = "&times;";
        closebutton.style = "padding: 5px; font-size: 340%; border: 2px solid black; margin-right: 2%; border-radius: 13px; background-color: transparent;";
        closebutton.onclick = function () { toggleAbout(); };

        topbar.style = "position: fixed; z-index: 9999; width: 100%; padding-top: 10px; padding-bottom: 10px; display: flex; justify-content: space-between; background-color: inherit; border-bottom: 1px solid black;";
        topbar.append(heading, closebutton);

        aboutcontainer.appendChild(topbar);
        document.body.appendChild(aboutcontainer);
        console.log(topbar.offsetHeight);
        console.log(aboutcontainer.offsetHeight);
        console.log(window.screen.height)
        console.log(window.screen.availHeight);

        const aboutcontentdiv = document.createElement("div");
        const paddingtop = (topbar.offsetHeight + 3) + "px";
        let height;
        if(window.screen.height === window.screen.availHeight) {
            //screen of a mobile
            height = (aboutcontainer.offsetHeight - topbar.offsetHeight - 58) + "px";
        }
        else {
            height = (aboutcontainer.offsetHeight - topbar.offsetHeight - 3) + "px";
        }
        aboutcontentdiv.style = "padding-top: " + paddingtop + "; position: fixed; overflow: scroll; height: " + height + "; width: 100%;";
        aboutcontentdiv.innerHTML = "<mark id=\"aboutcontentmark\">"+
        "This calendar app was developed as a submission to the "+
        "<a href=\"https://ai.google.dev/competition\" target=\"_blank\">"+
        "Gemini API Developer Competition</a><br><br>"+
        "Tech stack:-&nbsp;<br>"+
        "NodeJS<br>MongoDB<br>Gemini API<br>HTML/CSS/JS<br>"+
        "</mark>";
        aboutcontainer.appendChild(aboutcontentdiv);
    }
    else {
        document.body.removeChild(document.getElementById("aboutcontainer"));
    }
}


function addsidebarscontent() {
    document.getElementById("aisearchcontainer").style.zIndex = "999";
    addsidebar1content();
    addsidebar2content();
}


