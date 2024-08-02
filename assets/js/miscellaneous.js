class label {
    constructor(fullname) {
        this.full = fullname;
        this.short = this.reducename(3);
    }
    reducename(length) {
        if (length === (this.full.length - 1)) {
            return this.full;
        }
        else if (length >= this.full.length || length === 0) {
            console.log("Trying to shorten label failed! Invalid length given to shorten");
            return this.full;
        }
        let reduced = "";
        for (let i = 0; i < length; i++) {
            reduced = reduced + this.full[i];
        }
        return reduced;
    }
    matchesSomehow(name) {
        if ((name.length > this.full.length) || (name.length < this.short.length)) {
            return false;
        }
        else if ((name === this.full) || (name === this.short)) {
            return true;
        }
        let matchingletters = 0;
        for (let i = 0; i < name.length; i++) {
            if ((name[i] === this.full[i].toUpperCase()) || (name[i] === this.full[i].toLowerCase())) {
                matchingletters++;
            }
        }
        if (matchingletters === name.length) {
            return true;
        }
        return false;
    }
}

function hextorgb(hex) {
    const dummy = document.createElement("div");
    dummy.style.backgroundColor = hex;
    return dummy.style.backgroundColor;
}



function deleteElementFromArray(arr, index) {
    if (arr.length === 1 || index === (arr.length - 1)) {
        arr.pop();
        return;
    }
    for (let i = 0; i < (arr.length - 1); i++) {
        if (i >= index) {
            arr[i] = arr[i + 1];
        }
    }
    arr.pop();
}


function copyObj(source, deep) {
    var o, prop, type;
    if (typeof source != 'object' || source === null) {
        // What do to with functions, throw an error?
        o = source;
        return o;
    }
    o = new source.constructor();

    for (prop in source) {
        if (source.hasOwnProperty(prop)) {
            type = typeof source[prop];

            if (deep && type == 'object' && source[prop] !== null) {
                o[prop] = copyObj(source[prop]);
            }
            else {
                o[prop] = source[prop];
            }
        }
    }
    return o;
}


function printAllNodes(n) {
    for (let i = 0; i < n.length; i++) {
        printCellColors(n[i]);
    }
}
function printCellColors(grid) {
    let output = "";
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j].textContent === "TO") {
                output = output + grid[i][j].textContent + "|";
            }
            else if (grid[i][j].textContent !== "") {
                output = output + " " + grid[i][j].textContent + "|";
            }
            else {
                output = output + "__|";
            }
        }
        output = output + "\n";
    }
    console.log(output);
}