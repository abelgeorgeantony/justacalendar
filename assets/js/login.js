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
function validateinput() {
    const uname = document.getElementById("usernameid");
    const pword = document.getElementById("passwordid");
    const loginbutton = document.getElementById("loginsubmitbutton");
    if(uname.value === "" || pword.value === "") {
        loginbutton.setAttribute("disabled", "true");
    }
    else {
        loginbutton.removeAttribute("disabled");
    }
}


function attemptLogin() {
    const uname = document.getElementById("usernameid").value;
    const pword = document.getElementById("passwordid").value;
    submitDetails(uname, pword);
    document.getElementById("loginsubmitbutton").setAttribute("disabled", "true");
}

var xhttpsubmit = new XMLHttpRequest();
function submitDetails(username, password) {
    if (xhttpsubmit.readyState === 0 || xhttpsubmit.readyState === 4) {
        xhttpsubmit.open("POST", "/loginsubmit", true);
        xhttpsubmit.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpsubmit.send("username=" + username + "&password=" + password);
    }
    xhttpsubmit.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let login = JSON.parse(xhttpsubmit.response);
            if (login.authentic === true) {
                const authToken = login.authToken;
                console.log("Token: " + authToken);
                const expirydate = new Date();
                expirydate.setTime(expirydate.getTime() + (4 * 24 * 60 * 60 * 1000));
                const expires = "expires=" + expirydate.toUTCString();
                const cookiesettings = expires + "; SameSite=Strict" + "; path=/; domain=" + window.location.hostname;
                document.cookie = "username=" + login.username +"; "+cookiesettings;
                document.cookie = "authToken=" + login.authToken +"; "+cookiesettings;
                window.location.href = "/home";
            }
            else {
                //showLogInError();
            }
        }
    };
}