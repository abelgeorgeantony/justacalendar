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
function removelastrow() {
    const table = document.getElementById('calendar');
    const rows = table.querySelectorAll('tr');
    if (rows.length > 1) {
        rows[rows.length - 1].parentNode.removeChild(rows[rows.length - 1]);
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
    const cells = table.querySelectorAll('TD'); // assigning td to cells
    let datecount = 0;
    for (const [index, cell] of cells.entries()) {
        if (index === (firstday + datecount)) {
            datecount++;
            cell.textContent = datecount;
            cell.onclick = function () { showeventpopup(this); };
            if (datecount === cdate.getDate()) {
                cell.style.border = "4px solid #00b643";
            }
            if (cdate.getFullYear() === new Date().getFullYear()) {
                if (cdate.getMonth() === new Date().getMonth()) {
                    if (datecount === new Date().getDate()) {
                        cell.style.backgroundColor = "silver";
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
}