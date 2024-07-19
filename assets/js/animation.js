class loadingscreen {
    startanimation() {
        const screen = document.getElementById('loadingcontainer');
        screen.style.zIndex = "9999";
        this.animationloopid = setInterval(this.loadingTextAnimation, 900);
        this.userwasviewing = displayed_date;
        this.dateHoppingAnimationID = setInterval(this.startDateHopping, 330);
        this.animationrunning = true;
    }
    startDateHopping() {
        if (displayed_date.getFullYear() > 1830) {
            if (displayed_date.getMonth() > 3) {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() - 61), (displayed_date.getMonth() - 2), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() - 52), (displayed_date.getMonth() - 2), displayed_date.getDate() + 20);
                }
            }
            else {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() - 61), (displayed_date.getMonth() + 7), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() - 52), (displayed_date.getMonth() + 7), displayed_date.getDate() + 20);
                }
            }
        }
        else {
            if (displayed_date.getMonth() > 3) {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() + 181), (displayed_date.getMonth() - 2), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() + 183), (displayed_date.getMonth() - 2), displayed_date.getDate() + 20);
                }
            }
            else {
                if (displayed_date.getDate() > 7) {
                    updatedate((displayed_date.getFullYear() + 181), (displayed_date.getMonth() + 7), displayed_date.getDate() - 6);
                }
                else {
                    updatedate((displayed_date.getFullYear() + 183), (displayed_date.getMonth() + 7), displayed_date.getDate() + 20);
                }
            }
        }
    }
    stopDateHopping() {
        clearInterval(this.dateHoppingAnimationID);
        updatedate(this.userwasviewing.getFullYear(), this.userwasviewing.getMonth(), this.userwasviewing.getDate());
    }
    stopanimation() {
        this.stopDateHopping();
        clearInterval(this.animationloopid);
        this.animationrunning = false;
        const screen = document.getElementById('loadingcontainer');
        screen.style.zIndex = "-9";
        document.getElementById('loadingtext').innerText = ">";
    }
    loadingTextAnimation() {
        const loadingtext = document.getElementById('loadingtext');
        if (loadingtext.innerText.length !== 5) {
            loadingtext.innerText = loadingtext.innerText + ">";
        }
        else {
            loadingtext.innerText = ">";
        }
    }
}
const loading = new loadingscreen();


function startTopBarAnimation(element) {
    if (element !== null && element !== undefined) {
        element.setAttribute("disabled", "true");
    }
    document.querySelector(".eventloadingcontainer").style.zIndex = "99";
    document.querySelector(".loadingrunner").style.animationIterationCount = "infinite";
}
function stopTopBarAnimation(element) {
    document.querySelector(".eventloadingcontainer").style.zIndex = "-99";
    document.querySelector(".loadingrunner").style.animationIterationCount = "0";
    if (element !== null && element !== undefined) {
        element.removeAttribute("disabled");
    }
}



async function animateWelcomeMessage() {
    if (scramblerunning === false) {
        return;
    }
    const table = document.getElementById('calendar');
    if (document.getElementById("animationupdatemessage") === null) {
        const message = document.createElement("div");
        message.innerText = "Scrambling!";
        message.id = "animationupdatemessage";
        table.parentNode.insertBefore(message, table.parentNode.children[2]);
    }

    const originaltable = document.getElementById('calendar').cloneNode(true);
    //console.log(originaltable);
    await (scrambleTotally());
    await (scrambleTotally());
    //await (scrambleTotally());
    await delay(1000);
    const scrambledtable = document.getElementById('calendar').cloneNode(true);
    //document.getElementById("animationupdatemessage").innerText = "Solving!";
    //solveScramble(originaltable, scrambledtable);
    animateWelcomeMessage();
}
let scramblerunning = true;
function toggleScrambling() {
    if (document.getElementById("animationupdatemessage") === null) {
        const message = document.createElement("div");
        message.id = "animationupdatemessage";
        document.getElementById('calendar').parentNode.insertBefore(message, document.getElementById('calendar').parentNode.children[2]);
    }
    if (scramblerunning === true) {
        scramblerunning = false;
        document.getElementById("stopanimationbtn").innerHTML = "&#9658;";
        document.getElementById("animationupdatemessage").innerText = "Paused!";
    }
    else {
        scramblerunning = true;
        animateWelcomeMessage();
        document.getElementById("stopanimationbtn").innerHTML = "&#10073;&nbsp;&#10073;";
        document.getElementById("animationupdatemessage").innerText = "Scrambling!";
    }
}
async function scrambleTotally() {
    scramble(1, 4, 0, 6);
    await delay(5);
    await scrambleReverse(1, 4, 0, 6);
}

async function scramble(rstart, rend, cstart, cend) {
    const table = document.getElementById('calendar');
    let neighbors = [];
    const directions = [
        [-1, 0], [0, -1], [0, 1], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]
    ]; // top, left, right, bottom, top-left, top-right, bottom-left, bottom-right
    const rows = rend;
    const cols = cend;
    for (let row = rstart; row <= rows; row++) {
        for (let col = cstart; col <= cols; col++) {
            await delay(88);
            neighbors = [];
            for (const [dRow, dCol] of directions) {
                const nrow = row + dRow;
                const ncol = col + dCol;
                // Check if new cell is within grid bounds
                if (nrow >= rstart && nrow <= rend && ncol >= cstart && ncol <= cend) {
                    if (table.children[row].children[col].style.backgroundColor !== table.children[nrow].children[ncol].style.backgroundColor) {
                        neighbors.push({ row: nrow, col: ncol, color: table.children[nrow].children[ncol].style.backgroundColor });
                    }
                }
            }
            //console.log(neighbors.length);

            let rneighbor;
            if (neighbors.length > 1) {
                rneighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            }
            else if (neighbors.length === 1) {
                rneighbor = neighbors[0];
            }
            const temp1 = table.children[row].children[col];
            const temp2 = table.children[rneighbor.row].children[rneighbor.col];
            //console.log(table.children[row].children[col].innerText + "\nRow:" + row + " Col:" + col);
            //console.log(table.children[rneighbor.row].children[rneighbor.col].innerText + "\nRow:" + rneighbor.row + " Col:" + rneighbor.col);
            if (scramblerunning === false) {
                return;
            }
            table.children[row].replaceChild(temp2, temp1);
            table.children[rneighbor.row].insertBefore(temp1, table.children[rneighbor.row].children[rneighbor.col]);
        }
    }
}
async function scrambleReverse(rstart, rend, cstart, cend) {
    const table = document.getElementById('calendar');
    let neighbors = [];
    const directions = [
        [-1, 0], [0, -1], [0, 1], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]
    ]; // top, left, right, bottom, top-left, top-right, bottom-left, bottom-right
    for (let row = rend; row >= rstart; row--) {
        for (let col = cend; col >= cstart; col--) {
            await delay(88);
            neighbors = [];
            for (const [dRow, dCol] of directions) {
                const nrow = row + dRow;
                const ncol = col + dCol;
                // Check if new cell is within grid bounds
                if (nrow >= rstart && nrow <= rend && ncol >= cstart && ncol <= cend) {
                    if (table.children[row].children[col].style.backgroundColor !== table.children[nrow].children[ncol].style.backgroundColor) {
                        neighbors.push({ row: nrow, col: ncol, color: table.children[nrow].children[ncol].style.backgroundColor });
                    }
                }
            }
            //console.log(neighbors.length);

            let rneighbor;
            if (neighbors.length > 1) {
                rneighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            }
            else if (neighbors.length === 1) {
                rneighbor = neighbors[0];
            }
            else {
                continue;
            }
            const temp1 = table.children[row].children[col];
            const temp2 = table.children[rneighbor.row].children[rneighbor.col];
            //console.log(table.children[row].children[col].innerText + "\nRow:" + row + " Col:" + col);
            //console.log(table.children[rneighbor.row].children[rneighbor.col].innerText + "\nRow:" + rneighbor.row + " Col:" + rneighbor.col);
            if (scramblerunning === false) {
                return;
            }
            table.children[row].replaceChild(temp2, temp1);
            table.children[rneighbor.row].insertBefore(temp1, table.children[rneighbor.row].children[rneighbor.col]);
        }
    }
}
function delay(t) {
    return new Promise(resolve => {
        setTimeout(resolve, t);
    });
}



let moves = [];
async function solveScramble(ogtable, scrmbldtable) {
    let ogtable_grid = [];
    let scrmbldtable_grid = [];
    for (let i = 0; i < (scrmbldtable.children.length - 1); i++) {
        scrmbldtable_grid[i] = [];
        ogtable_grid[i] = [];
        for (let j = 0; j < (scrmbldtable.children[1].children.length); j++) {
            scrmbldtable_grid[i][j] = scrmbldtable.children[i + 1].children[j];
            ogtable_grid[i][j] = ogtable.children[i + 1].children[j];
        }
    }

    expandNode(scrmbldtable_grid);
    const expandedNodes = copyObj(xnodes, true);
    xnodes.length = 0;
    //console.log("Possible moves: " + expandedNodes.length);
    //printAllNodes(expandedNodes);
    let nextstate = findLeastManhattan(expandedNodes);
    //console.log("Preffered Node: "+nextstate);
    //printCellColors(nextstate);
    console.log("Possible moves: " + expandedNodes.length);
    console.log("Manhattan: " + manhattan(nextstate));
    //return;
    const table = document.getElementById("calendar");
    const rows = nextstate.length;
    const cols = nextstate[0].length;
    deletetable();
    for (let i = 0; i < rows; i++) {
        addaemptyrow();
        for (let j = 0; j < cols; j++) {
            table.children[i + 1].appendChild(nextstate[i][j]);
        }
    }
    moves.push(nextstate);
    await delay(500);
    if (ogtable !== table) {
        console.log(table);
        solveScramble(ogtable, table);
    }
}




const xnodes = [];
const ignorecells = [];
const rows = 4; // gnode.length
const cols = 7; // gnode[0].length
const directions = [
    [-1, 0], [0, -1], [0, 1], [1, 0]
]; // top, left, right, bottom
function expandNode(gnode) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if ((Number(gnode[row][col].id) === 0) && (shouldIgnore(row, col) === false)) {// Id == 0, means the cell is a blank space
                for (const [d_row, d_col] of directions) {
                    const nrow = row + d_row;
                    const ncol = col + d_col;
                    if (nrow >= 0 && nrow < rows && ncol >= 0 && ncol < cols && (Number(gnode[nrow][ncol].id) !== 0) && (shouldIgnore(nrow, ncol) === false)) {
                        const tempnode = copyObj(gnode, true);
                        const temp = tempnode[row][col];
                        tempnode[row][col] = tempnode[nrow][ncol];
                        tempnode[nrow][ncol] = temp;
                        xnodes.push(copyObj(tempnode, true));
                        ignorecells.push({ r: row, c: col });
                        ignorecells.push({ r: nrow, c: ncol });
                        expandNode(copyObj(tempnode, true));
                        ignorecells.pop();
                        ignorecells.pop();
                    }
                }
                if (ignorecells.length === 0) {
                    return;
                }
            }
        }
    }
    return;
}
function shouldIgnore(row, col) {
    if (ignorecells.length > 0) {
        for (let i = 0; i < ignorecells.length; i++) {
            if ((ignorecells[i].r === row) && (ignorecells[i].c === col)) {
                return true;
            }
        }
    }
    return false;
}




function expandNode1(gnode) {
    const xnodes = [];
    const directions = [
        [-1, 0], [0, -1], [0, 1], [1, 0]
    ]; // top, left, right, bottom

    const rows = gnode.length;
    const cols = gnode[0].length;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Number(gnode[row][col].id) === 0) {
                for (const [dRow, dCol] of directions) {
                    const nrow = row + dRow;
                    const ncol = col + dCol;
                    const tempnode = copyObj(gnode, true);
                    if (nrow >= 0 && nrow < rows && ncol >= 0 && ncol < cols && (Number(gnode[nrow][ncol].id) !== 0)) {
                        const temp = tempnode[row][col];
                        tempnode[row][col] = tempnode[nrow][ncol];
                        tempnode[nrow][ncol] = temp;
                        xnodes.push(copyObj(tempnode, true));
                    }
                    for (let r = row; r < rows; r++) {
                        for (let c = col; c < cols; c++) {
                            if ((Number(tempnode[r][c].id) === 0) && (r !== row) && (c !== col) && (r !== nrow) && (c !== ncol)) {
                                for (const [dRow, dCol] of directions) {
                                    const nr = r + dRow;
                                    const nc = c + dCol;
                                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && (Number(tempnode[nr][nc].id) !== 0)) {
                                        const temp = tempnode[r][c];
                                        tempnode[r][c] = tempnode[nr][nc];
                                        tempnode[nr][nc] = temp;
                                        xnodes.push(copyObj(tempnode, true));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return xnodes;
}






function expandNode2(gnode) {
    const xnodes = [];
    const directions = [
        [-1, 0], [0, -1], [0, 1], [1, 0]
    ]; // top, left, right, bottom

    const rows = gnode.length;
    const cols = gnode[0].length;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Number(gnode[row][col].id) === 0) {
                for (const [dRow, dCol] of directions) {
                    const nrow = row + dRow;
                    const ncol = col + dCol;

                    // Check if new cell is within grid bounds
                    if (nrow >= 0 && nrow < rows && ncol >= 0 && ncol < cols && Number(gnode[nrow][ncol].id) !== 0) {
                        const tempnode = copyObj(gnode, true);
                        const temp = tempnode[row][col];
                        //console.log("Before swapping:\n"+tempnode[row][col].id+"\n"+tempnode[nrow][ncol].id);
                        tempnode[row][col] = tempnode[nrow][ncol];
                        tempnode[nrow][ncol] = temp;
                        xnodes.push(tempnode);
                        //console.log("After swapping:\n"+tempnode[row][col].id+"\n"+tempnode[nrow][ncol].id);
                    }
                }
            }
        }
    }
    return xnodes;
}

function findLeastManhattan(nodes) {
    let prefferednode;
    let lowestsum = null;
    let highestsum = null;
    let lowestwrongcount = null;
    //console.log("List of sums:");
    for (let i = 0; i < nodes.length; i++) {
        const sum = manhattan(nodes[i]);
        const wrongcount = hamming(nodes[i]);
        //console.log(sum);

        if (((sum < lowestsum) || (lowestsum === null)) && ((wrongcount < lowestwrongcount) || (lowestwrongcount === null))) {
            prefferednode = nodes[i];
            lowestsum = sum;
            lowestwrongcount = wrongcount;
        }
        if (sum > highestsum || highestsum === null) {
            highestsum = sum;
        }
    }
    console.log("lowest:\n" + lowestsum);
    console.log("highest:\n" + highestsum);
    return prefferednode;
}
function manhattan(g) {
    let sumofdistances = 0; // This is how it is determined how different is the current grid from the goal grid;
    const rows = g.length;
    const cols = g[0].length;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Number(g[row][col].id) !== 0) {
                const index = ((row * cols) + col);
                const correct_index = (Number(g[row][col].id) - 1);
                const correctrow = Math.floor(correct_index / cols);
                const correctcol = correct_index % cols;
                if (index !== correct_index) {
                    //console.log("Distance of "+t.children[row].children[col].textContent+": "+(Math.abs((row-1)-correctrow) + Math.abs(col-correctcol)));
                    sumofdistances = sumofdistances + (Math.abs(row - correctrow) + Math.abs(col - correctcol));
                }
            }
        }
    }
    return sumofdistances;
}
function hamming(g) {
    let wrongcount = 0;
    const rows = g.length;
    const cols = g[0].length;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Number(g[row][col].id) !== 0) {
                const index = ((row * cols) + col);
                if (Number(g[row][col].id) !== (index + 1)) {
                    wrongcount++;
                }
                else {
                    //console.log("Correctly placed cell:\n" + g[row][col].textContent);
                }
            }
        }
    }
    return wrongcount
}


function equalNodes(n1, n2) {
    for (let i = 0; i < n1.length; i++) {
        for (let j = 0; j < n1[0].length; j++) {
            if (n1[i][j].id !== n2[i][j].id) {
                return false;
            }
        }
    }
    return true;
}



function hammingfortable(t) {
    let wrongcount = 0;
    const rows = t.children.length;
    const cols = t.children[1].children.length;
    for (let row = 1; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = (((row - 1) * cols) + col);
            //console.log("Index: "+(index+1));
            //console.log(t.children[row].children[col].id);
            if (Number(t.children[row].children[col].id) !== (index + 1)) {
                wrongcount++;
            }
            else {
                console.log("Correctly placed cell:\n" + t.children[row].children[col].textContent);
            }
        }
    }
    return wrongcount;
}
function manhattanfortable(t) {
    let sumofdistances = 0; // This is how it is determined how different is the current grid from the goal grid;
    const rows = t.children.length;
    const cols = t.children[1].children.length;
    for (let row = 1; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Number(t.children[row].children[col].id) !== 0) {
                const index = (((row - 1) * cols) + col);
                const correct_index = (Number(t.children[row].children[col].id) - 1);
                const correctrow = Math.floor(correct_index / cols);
                const correctcol = correct_index % cols;
                if (index !== correct_index) {
                    //console.log("Distance of "+t.children[row].children[col].textContent+": "+(Math.abs((row-1)-correctrow) + Math.abs(col-correctcol)));
                    sumofdistances = sumofdistances + (Math.abs((row - 1) - correctrow) + Math.abs(col - correctcol));
                }
            }
        }
    }
    return sumofdistances;
}