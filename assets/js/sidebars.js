function addsidebar1content() {
    const sidebar = document.getElementById('calsidebar1');
    sidebar.innerHTML = "";
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    const cellcontent = [
        "<a href=\"javascript:openShortcuts();\" id=\"shortcutsbtn\"><img class=\"sidebarimgs\" id=\"shortcutsimg\" alt=\"Shortcuts\">" + "</a>",
        "<a href=\"javascript:openEvents();\" id=\"eventslistbtn\"><img class=\"sidebarimgs\" id=\"eventslistimg\" alt=\"Events List\">" + "</a>",
        "<a href=\"javascript:openAIchat();\" id=\"aichatbtn\"><img class=\"sidebarimgs\" id=\"aichatimg\" alt=\"AI Chat\">" + "</a>",
        "<a href=\"javascript:openAccountandSettings();\" id=\"useraccountbtn\"><img class=\"sidebarimgs\" id=\"useraccountimg\" alt=\"User Account\">" + "</a>"
    ];
    if (css_devicesmall === "false") {
        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
            sidebar.appendChild(tr);
        }
    }
    else {
        const tr = document.createElement('tr');
        for (let i = 0; i < 4; i++) {
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
        }
        sidebar.appendChild(tr);
    }
}
function addsidebar2content() {
    const sidebar = document.getElementById('calsidebar2');
    sidebar.innerHTML = "";
    const css_devicesmall = getComputedStyle(document.querySelector(':root')).getPropertyValue("--devicesmall");
    const cellcontent = [
        "<a href=\"javascript:showdatepicker();\" style=\"background-color: rgb(0, 182, 67)\">" + displayed_date.getDate() + "</a>",
        "<a href=\"javascript:showdatepicker();\" style=\"background-color: rgb(0, 182, 67)\">" + months[displayed_date.getMonth()].short + "</a>",
        "<a href=\"javascript:showdatepicker();\" style=\"background-color: rgb(0, 182, 67)\">" + displayed_date.getFullYear() + "</a>",
        "<a href=\"javascript:timeHop();\" style=\"background-color: rgb(0, 160, 246);\">" + "Time<br>Hop" + "</a>"
    ];
    if (css_devicesmall === "false") {
        for (let i = 0; i < 4; i++) {
            const tr = document.createElement('tr');
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
            sidebar.appendChild(tr);
        }
    }
    else {
        const tr = document.createElement('tr');
        for (let i = 0; i < 4; i++) {
            const cell = document.createElement('td');
            cell.innerHTML = cellcontent[i];
            tr.appendChild(cell);
        }
        sidebar.appendChild(tr);
    }
}