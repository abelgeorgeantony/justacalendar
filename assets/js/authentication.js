var xhttpcheck = new XMLHttpRequest();
function isLoggedIn(loadPage) {
    const username = getCookie("username");
    const authToken = getCookie("authToken");
    if (username !== undefined || authToken !== undefined) {
        console.log("entered check");
        xhttpcheck.open("POST", "/checktokenauthenticity", true);
        xhttpcheck.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttpcheck.send("username=" + username + "&authToken=" + authToken);
        
        xhttpcheck.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const result = JSON.parse(xhttpcheck.response);
                console.log("Authentic:" + result.authentic);
                loadPage(result.authentic);
            }
        };
    }
    else {
        console.log("Cookies don't exist");
        loadPage(false);
    }
}