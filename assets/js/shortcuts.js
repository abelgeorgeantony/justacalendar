function openShortcutAdder() {
    const container = document.createElement("div");
    const adderpopup = document.createElement("div");
    const popupheader = document.createElement("div");
    const popupbody = document.createElement("div");

    container.id = "shortcutaddercontainer";
    container.style = "position: absolute; height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center;";

    const heading = document.createElement("h3");
    heading.innerText = "Shortcut Maker";
    heading.style = "margin-left: 4%;";
    const closebtn = document.createElement("button");
    closebtn.innerHTML = "&times;";
    closebtn.setAttribute("onclick", "closeShortcutAdder()");
    closebtn.style = "margin-right: 4%; font-size: 200%; height: max-content;";
    popupheader.append(heading, closebtn);
    popupheader.style = "display: flex; flex-direction: row; align-items: center; justify-content: space-between; background-color: rgb(54, 175, 255); border-bottom: 3px solid black;";

    const aipromptinput = document.createElement("textarea");
    aipromptinput.placeholder = "Describe to the AI how the shortcut should work!";
    aipromptinput.id = "shortcutdescriptioninput";
    aipromptinput.style = "width: 90%; margin-left: 2%;";
    const brewshortcutbtn = document.createElement("button");
    brewshortcutbtn.innerText = "Brew a shortcut!";
    brewshortcutbtn.setAttribute("onclick", "brewShortcutUsingAI()");
    brewshortcutbtn.style = "width: fit-content; margin-top: 2px; margin-left: 2%; font-size: 100%;"

    const brewresultheading = document.createElement("h4");
    brewresultheading.innerText = "Brewed up shortcut definition:";
    brewresultheading.style = "margin-left: 2%; margin-bottom: 2px; ";
    const brewresult = document.createElement("div");
    brewresult.innerText = "test();"
    brewresult.id = "brewresult";
    brewresult.style = "margin-left: 2%; width: fit-content; border: 2px solid black; border-radius: 5px;";

    const saveshortcutbtn = document.createElement("button");
    saveshortcutbtn.innerText = "Save Shortcut!";
    saveshortcutbtn.setAttribute("onclick", "saveBrewedShortcut()");
    saveshortcutbtn.style = "margin-top: 7px; font-size: 120%; width: 90%; align-self: center;"

    popupbody.append(aipromptinput, brewshortcutbtn, brewresultheading, brewresult, saveshortcutbtn);
    popupbody.style = "display: flex; flex-direction: column; padding-top: 2%; padding-bottom: 2%;";
    adderpopup.style = "width: 75%; margin-left: -16px; background-color: white; border: 5px solid black; border-radius: 10px;";

    adderpopup.append(popupheader, popupbody);
    container.appendChild(adderpopup);
    document.getRootNode().body.appendChild(container);
    console.log(document.getRootNode().body);
}

function closeShortcutAdder() {
    document.getRootNode().body.removeChild(document.getElementById("shortcutaddercontainer"));
}


const brewshortcut = new XMLHttpRequest();
function brewShortcutUsingAI() {
    const description = document.getElementById("shortcutdescriptioninput").value;
    console.log(description);
    if (brewshortcut.readyState === 0 || brewshortcut.readyState === 4) {
        brewshortcut.open("POST", "/brewshortcutusingai", true);
        brewshortcut.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded",
        );
        brewshortcut.send("description=" + description);
    }
    brewshortcut.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const res = JSON.parse(brewshortcut.response);
            console.log(res);
        }
    };
}