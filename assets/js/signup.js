class myname {
    constructor(fulln) {
        this.fullname = fulln;
        this.shortname = this.reducename(3);
    }
    reducename(length) {
        if (length === (this.fullname.length - 1)) {
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

class inputfield {
    constructor(name) {
        this.id = name + "id";
        this.container = name + "container";
        this.errorbox = name + "error";
        this.errors = [];
    }
    errorExists(errorToFind) {
        for (const error of this.errors) {
            if (error === errorToFind) {
                return true;
            }
        }
        return false;
    }
    addError(errorToAdd) {
        if (this.errorExists(errorToAdd) === false) {
            this.errors.push(errorToAdd);
        }
        return (this.errors.length - 1);
    }
    removeError(errorToRemove) {
        if (Number(errorToRemove)) {
            errorToRemove = this.errors[errorToRemove];
        }
        for (const [index, error] of this.errors.entries()) {
            if (error === errorToRemove) {
                this.errors[index] = "";
            }
            if ((this.errors[index] === "") && ((index + 1) < this.errors.length)) {
                this.errors[index] = this.errors[index + 1];
                this.errors[index + 1] = "";
            }
            else if ((this.errors[index] === "") && ((index + 1) === this.errors.length)) {
                this.errors.pop();
            }
        }
    }
    errorsAsHTML() {
        if (this.errors.length === 0) {
            return "";
        }
        let output = "";
        for (const error of this.errors) {
            output = output + "&#x2022;" + error + "<br>";
        }
        return output;
    }
}

const usernameobj = new inputfield("username");
const emailobj = new inputfield("email");
const passwordobj = new inputfield("password");
const repeatpasswordobj = new inputfield("repeatpassword");
const fieldslist = [usernameobj, emailobj, passwordobj, repeatpasswordobj];


function val_username() {
    const input = document.getElementById(usernameobj.id);
    if (/\d/.test(input.value[0]) === true) {
        usernameobj.addError("First character should not be a number!");
    }
    else {
        usernameobj.removeError("First character should not be a number!");
    }
    if (/[^0-9a-z_]/g.test(input.value) === true) {
        usernameobj.addError("Characters should only contain: a-z,0-9,_");
    }
    else {
        usernameobj.removeError("Characters should only contain: a-z,0-9,_");
    }
    if (input.value.length <= 3) {
        usernameobj.addError("Username too short, Needs to be longer than 3 characters!");
    }
    else {
        usernameobj.removeError("Username too short, Needs to be longer than 3 characters!");
    }
    if (input.value.length > 16) {
        usernameobj.addError("Username too big, Needs to be less than 18 characters!");
    }
    else {
        usernameobj.removeError("Username too big, Needs to be less than 18 characters!");
    }


    if (usernameobj.errors.length === 0) {
        isUsernameAvailable(input.value);
    }
    else if (usernameobj.errorExists("Username is not available")) {
        isUsernameAvailable(input.value);
    }
    else {
        usernameobj.removeError("Username is not available")
    }
    updateErrorOutput(usernameobj);
}


function val_passwordfields() {
    val_password();
    val_repeatpassword();
}
let invalid_char = null;
function val_password() {
    
    const invalid_pass = /[^0-9a-zA-Z_]/g;
    const input = document.getElementById(passwordobj.id);
    if (invalid_pass.test(input.value) === true) {
        if (invalid_char === null) {
            invalid_char = input.value.match(invalid_pass);
            passwordobj.addError("Invaild character found: " + invalid_char);
        }
        else {
            passwordobj.removeError("Invaild character found: " + invalid_char);
            invalid_char = input.value.match(invalid_pass);
            passwordobj.addError("Invaild character found: " + invalid_char);
        }
    }
    else if (invalid_char !== null) {
        passwordobj.removeError("Invaild character found: " + invalid_char);
        invalid_char = null;
    }
    if (input.value.length <= 6) {
        passwordobj.addError("Password too short, Needs to be longer than 6 characters!");
    }
    else {
        passwordobj.removeError("Password too short, Needs to be longer than 6 characters!");
    }
    if (input.value.length > 15) {
        passwordobj.addError("Password too big, Needs to be less than 16 characters!");
    }
    else {
        passwordobj.removeError("Password too big, Needs to be less than 16 characters!");
    }
    updateErrorOutput(passwordobj);
}
function val_repeatpassword() {
    const pinput = document.getElementById(passwordobj.id);
    const rpinput = document.getElementById(repeatpasswordobj.id);
    if (pinput.value.length === 0) {
        repeatpasswordobj.addError("Fill the above password field!");
    }
    else {
        repeatpasswordobj.removeError("Fill the above password field!");
        if (passwordobj.errors.length !== 0) {
            repeatpasswordobj.addError("You have unsolved errors in password field!");
        }
        else {
            repeatpasswordobj.removeError("You have unsolved errors in password field!");
            if (rpinput.value !== pinput.value) {
                repeatpasswordobj.addError("Passwords don't match!");
            }
            else {
                repeatpasswordobj.removeError("Passwords don't match!");
            }
        }
    }
    updateErrorOutput(repeatpasswordobj);
}

var xhttpsearch = new XMLHttpRequest();
function isUsernameAvailable(usernametosearch) {
    if (xhttpsearch.readyState === 0 || xhttpsearch.readyState === 4) {
        xhttpsearch.open("POST", "/searchusername", true);
        xhttpsearch.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpsearch.send("uname=" + usernametosearch);
    }
    xhttpsearch.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let name = JSON.parse(xhttpsearch.response);
            console.log(name.available);
            if (name.available === false) {
                usernameobj.addError("Username is not available");
            }
            else {
                usernameobj.removeError("Username is not available");
            }
            updateErrorOutput(usernameobj);
        }
    };
}



function updateErrorOutput(field) {
    document.getElementById("signupsubmitbutton").setAttribute("disabled", "true");
    const container = document.getElementById(field.container);
    let errorbox = document.getElementById(field.errorbox);
    if (errorbox === null) {
        errorbox = document.createElement("div");
        errorbox.id = field.errorbox;
        container.appendChild(errorbox);
    }
    if (field.errorsAsHTML() === "") {
        container.removeChild(container.children[container.children.length - 1]);
    }
    else {
        errorbox.innerHTML = field.errorsAsHTML();
    }
    if (isAllFieldsValid() === true) {
        document.getElementById("signupsubmitbutton").removeAttribute("disabled");
    }
}

function isAllFieldsValid() {
    for (let i = 0; i < fieldslist.length; i++) {
        if (fieldslist[i].errors.length > 0 || document.getElementById(fieldslist[i].id).value === "") {
            return false;
        }
    }
    return true;
}

function togglePassVisibility(hidebutton) {
    if (hidebutton.parentElement.children[0].children[2].type === "password") {
        hidebutton.parentElement.children[0].children[2].type = "text";
        hidebutton.children[0].src = "restricted_eye_black.png";
    }
    else {
        hidebutton.parentElement.children[0].children[2].type = "password";
        hidebutton.children[0].src = "eye_black.png";
    }
}


function attemptSignup() {
    const uname = document.getElementById("usernameid").value;
    const pword = document.getElementById("passwordid").value;
    const emailaddress = document.getElementById("emailid").value;
    submitDetails(uname, pword, emailaddress);
    document.getElementById("signupsubmitbutton").setAttribute("disabled", "true");
}

var xhttpsubmit = new XMLHttpRequest();
function submitDetails(username, password, email) {
    if (xhttpsubmit.readyState === 0 || xhttpsubmit.readyState === 4) {
        xhttpsubmit.open("POST", "/signupsubmit", true);
        xhttpsubmit.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpsubmit.send("username=" + username + "&password=" + password + "&email=" + email);
    }
    xhttpsubmit.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let account = JSON.parse(xhttpsubmit.response);
            if (account.created === true) {
                const authToken = account.authToken;
                console.log("Token: " + authToken);
                const expirydate = new Date();
                expirydate.setTime(expirydate.getTime() + (4 * 24 * 60 * 60 * 1000));
                let expires = "expires=" + expirydate.toUTCString();
                //const time = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate() + 4);
                //const cookiesettings = "expires=" + time.getDay() + ", " + time.getDate() + " " + months[time.getMonth()].shortname + " " + time.getFullYear() + " 12:00:00 UTC; SameSite=Strict";
                const cookiesettings = expires + "; SameSite=Strict" + "; path=/; domain=" + window.location.hostname;
                document.cookie = "username=" + account.username + "; " + cookiesettings;
                document.cookie = "authToken=" + account.authToken + "; " + cookiesettings;
                window.location.href = "/home";
            }
            else {
                //showSignUpError();
            }
        }
    };
}