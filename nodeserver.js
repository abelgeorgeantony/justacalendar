const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const url = require("url");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pipeline = require("node:stream/promises");
//import { pipeline } from "node:stream/promises";
const crypto = require("crypto");


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = "mongodb://127.0.0.1:27017/";
const mongoclient = new MongoClient(uri);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/html/calendar.html"));
});
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/html/calendar.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/html/login.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/html/signup.html"));
});


app.get("/animation.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/animation.js"));
});
app.get("/authentication.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/authentication.js"));
});
app.get("/cookies.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/cookies.js"));
});
app.get("/main.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/main.js"));
});
app.get("/miscellaneous.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/miscellaneous.js"));
});
app.get("/monthcalendar.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/monthcalendar.js"));
});
app.get("/popups.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/popups.js"));
});
app.get("/sidebars.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/sidebars.js"));
});
app.get("/time.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/time.js"));
});
app.get("/timehop.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/timehop.js"));
});
app.get("/windows.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/windows.js"));
});
app.get("/signup.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/signup.js"));
});
app.get("/login.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/login.js"));
});



app.get("/calendar.css", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/css/calendar.css"));
});
app.get("/popups.css", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/css/popups.css"));
});
app.get("/signup.css", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/css/signup.css"));
});




app.get("/user_account_icon_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/user_account_icon_black.png"));
});
app.get("/user_account_icon_white.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/user_account_icon_white.png"));
});
app.get("/aichat_icon_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/aichat_icon_black.png"));
});
app.get("/aichat_icon_white.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/aichat_icon_white.png"));
});
app.get("/events_icon_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/events_icon_black.png"));
});
app.get("/events_icon_white.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/events_icon_white.png"));
});
app.get("/eye_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/eye_black.png"));
});
app.get("/restricted_eye_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/images/restricted_eye_black.png"));
});



app.post("/signupsubmit", urlencodedParser, async (req, res) => {
    console.log("/signupsubmit Request recieved");
    const username = req.body.username;
    const passwordhash = crypto.pbkdf2Sync(req.body.password, username, 1000, 64, `sha512`).toString(`hex`);
    const email = req.body.email;
    try {
        await mongoclient.connect();
        const userscollection = mongoclient.db("jac").collection("users");
        try {
            await userscollection.insertOne({ "username": username, "passwordhash": passwordhash, "email": email });
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "created": false });
            await mongoclient.close();
            return;
        }
        const authToken = await loginUser(username, req.body.password);
        res.status(200).send({ "created": true, "authToken": authToken, "username": username });
    } finally {
        await mongoclient.close();
    }
});
app.post("/loginsubmit", urlencodedParser, async (req, res) => {
    console.log("/loginsubmit Request recieved");
    const username = req.body.username;
    const password = req.body.password;
    try {
        const authToken = await loginUser(username, password);
        res.status(200).send({ "authentic": true, "authToken": authToken, "username": username });
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ "authentic": false });
        await mongoclient.close();
        return;
    }
    finally {
        await mongoclient.close();
    }
});
app.post("/checktokenauthenticity", urlencodedParser, async (req, res) => {
    console.log("/checktokenauthenticity Request received");
    try {
        await mongoclient.connect();
        const userscollection = mongoclient.db("jac").collection("users");
        try {
            let result = await userscollection.findOne({ "username": req.body.username }, { _id: 0, username: 0, passwordhash: 0, email: 0, authtoken: 1 });
            //console.log("Authtoken in db:" + result.authtoken);
            //console.log("Authtoken given:" + req.body.authToken);
            if (result.authtoken === req.body.authToken) {
                res.status(200).send({ "authentic": true });
            }
            else {
                res.status(200).send({ "authentic": false });
            }
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "authentic": false });
            await mongoclient.close();
            return;
        }
    } finally {
        await mongoclient.close();
    }
});


app.post("/searchusername", urlencodedParser, async (req, res) => {
    const unametosearch = req.body.uname;
    try {
        await mongoclient.connect();
        const userscollection = mongoclient.db("jac").collection("users");
        const result = await userscollection.findOne({ "username": unametosearch }, { _id: 0, username: 1, passwordhash: 0, email: 0 });
        if (result === null) {
            res.status(200).send({ "available": true });
        }
        else {
            res.status(200).send({ "available": false });
        }
    } finally {
        await mongoclient.close();
    }
});
app.post("/eventsubmit", urlencodedParser, async (req, res) => {
    const daystart = new Date((req.body.date));
    const dayend = new Date((req.body.date + "T23:59Z"));

    const uname = req.body.username;
    const datetimeofevent = new Date((req.body.date + "T" + req.body.time + "Z"));
    const colorofevent = req.body.color;
    const nameofevent = req.body.name;
    const descriptionofevent = req.body.description;
    try {
        await mongoclient.connect();
        const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
        try {
            const neweventid_local = (await eventscollection.find({ $and: [{ "datetime": { $gt: daystart } }, { "datetime": { $lt: dayend } }] }).count() + 1);
            const neweventid_global = (await eventscollection.countDocuments() + 1);
            await eventscollection.insertOne({ "eventid_local": neweventid_local, "eventid_global": neweventid_global, "datetime": datetimeofevent, "color": colorofevent, "name": nameofevent, "description": descriptionofevent });
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "eventadded": false });
            await mongoclient.close();
            return;
        }
        res.status(200).send({ "eventadded": true });
    } finally {
        await mongoclient.close();
    }
});
app.post("/eventofdayrequest", urlencodedParser, async (req, res) => {
    const uname = req.body.username;
    const daystart = new Date((req.body.date));
    const dayend = new Date((req.body.date + "T23:59Z"));
    const lastsentid = Number(req.body.lastreceivedeventid);

    try {
        await mongoclient.connect();
        const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
        let userevent;
        try {
            userevent = await eventscollection.findOne({ "eventid_local": { $gt: lastsentid }, $and: [{ "datetime": { $gt: daystart } }, { "datetime": { $lt: dayend } }] });
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "eventfound": false, "error": true, "eventsfinished": false });
            await mongoclient.close();
            return;
        }
        if (userevent !== null) {
            res.status(200).send({ "eventfound": true, "eventid": userevent.eventid_local, "datetime": userevent.datetime, "color": userevent.color, "name": userevent.name, "description": userevent.description });
        }
        else {
            res.status(200).send({ "eventfound": false, "error": false, "eventsfinished": true });
        }
    } finally {
        await mongoclient.close();
    }
});
app.post("/upcomingeventrequest", urlencodedParser, async (req, res) => {
    const uname = req.body.username;
    const curr_datetime = new Date(req.body.currentdate + "T" + req.body.currenttime + "Z");
    const lastsentid = Number(req.body.lastreceivedeventid);

    try {
        await mongoclient.connect();
        const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
        let userevent;
        try {
            userevent = await eventscollection.findOne({ "datetime": { $gte: curr_datetime }, "eventid_global": { $gt: lastsentid } });
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "eventfound": false, "error": true, "eventsfinished": false });
            await mongoclient.close();
            return;
        }
        if (userevent !== null) {
            res.status(200).send({ "eventfound": true, "eventid": userevent.eventid_global, "datetime": userevent.datetime, "color": userevent.color, "name": userevent.name, "description": userevent.description });
        }
        else {
            res.status(200).send({ "eventfound": false, "error": false, "eventsfinished": true });
        }
    } finally {
        await mongoclient.close();
    }
});
app.post("/aichathistoryrequest", urlencodedParser, async (req, res) => {
    const uname = req.body.username;
    let lastsentid = Number(req.body.lastreceivedid);
    //const curr_datetime = new Date(req.body.currentdate + "T" + req.body.currenttime + "Z");
    //console.log(curr_datetime);

    try {
        await mongoclient.connect();
        const chatscollection = mongoclient.db("jac_aichats").collection(uname + "aichats");
        let singlechat;
        try {
            if (lastsentid === -1) {
                lastsentid = await chatscollection.countDocuments();
            }
            else {
                lastsentid = (lastsentid - 1);
            }
            singlechat = await chatscollection.findOne({ "chatid_global": { $eq: lastsentid } });
            //console.log(singlechat);
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "chatfound": false, "error": true, "chatsfinished": false });
            await mongoclient.close();
            return;
        }
        if (singlechat !== null) {
            res.status(200).send({ "chatfound": true, "error": false, "chatsfinished": false, "chatid": singlechat.chatid_global, "datetime": singlechat.datetime, "chatinitby": singlechat.chatinitby, "usermsg": singlechat.usermsg, "aimsg": singlechat.aimsg });
        }
        else {
            res.status(200).send({ "chatfound": false, "error": false, "chatsfinished": true });
        }
    } finally {
        await mongoclient.close();
    }
});

app.post("/aichatmsgsubmit", urlencodedParser, async (req, res) => {
    const daystart = new Date((req.body.date));
    const dayend = new Date((req.body.date + "T23:59Z"));

    const uname = req.body.username;
    const msg = req.body.message;
    const datetimeofmsg = new Date((req.body.date + "T" + req.body.time + "Z"));
    const replyFromGemini = await sendMessageToGemini(msg).catch((e) => {
        console.error(e);
        //process.exit(1);
        return;
    });

    res.status(200).send({ "reply": replyFromGemini });
    //console.log(replyFromGemini);

    try {
        await mongoclient.connect();
        const chatscollection = mongoclient.db("jac_aichats").collection(uname + "aichats");
        try {
            const newchatid_global = (await chatscollection.countDocuments() + 1);
            const newchatid_local = (await chatscollection.find({ $and: [{ "datetime": { $gt: daystart } }, { "datetime": { $lt: dayend } }] }).count() + 1);
            await chatscollection.insertOne({ "chatid_global": newchatid_global, "chatid_local": newchatid_local, "datetime": datetimeofmsg, "chatinitby": "user", "usermsg": msg, "aimsg": replyFromGemini });
        }
        catch (err) {
            console.log(err);
            //res.status(200).send({ "eventfound": false, "error": true, "eventsfinished": false });
            await mongoclient.close();
            return;
        }
    } finally {
        await mongoclient.close();
    }
});

app.get("/aisearchsuggest", async (req, res) => {
    console.log("/aisearchsuggest Request receivedf");
    const prompt = "I have a calendar app. A user has entered a query that isn't complete(partial query) into a searchbar in my app. Consider yourself a searchbar and try to complete the partial query that the user has entered. Be careful to structure the suggestions such that they are logical and related to the partial query as much as possible. Limit yourself to generating a maximum of 11 completions for the partial query. Don't generate anything else, generate only completions seperated with a semicolon \";\" also donot use seperators like newline anywhere in your output. 2 consecutive semicolons \";;\" will mark the end of the 11 completions. An example output:g1;2;g3,...,g11;; The partial query:";
    const partialsearch = req.query.partiallysearched;
    console.log("partialsearch: "+partialsearch);
    const completeprompt= prompt + partialsearch;
    const result = await model.generateContentStream([completeprompt]);


    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    });
    for await (const chunk of result.stream) {
        console.log(chunk.text() + "1")
        res.write(chunk.text());
    }

    //res.send(chunkText);
});


app.get("/reqtimehop", async (req, res) => {
    const responseFromGemini = await reqtimehopFromGemini().catch((e) => {
        console.error(e);
        process.exit(1);
    });
    const jsonContent = JSON.stringify(responseFromGemini);
    //console.log(jsonContent);
    res.send(jsonContent);
});



const portnumber = 3000;
const address = "192.168.156.40";
app.listen(portnumber, address, () => {
    console.log("Server running in address: " + address);
    console.log("Port: " + portnumber);
});


async function reqtimehopFromGemini() {
    let prompt = "Pick a date very randomly ranging from the year 1500 to 2024. Give output in the format:YYYY/MM/DD";
    let rand_date = await model.generateContent(prompt);
    rand_date = rand_date.response;
    prompt = rand_date.text() + " is a date. Tell a fact or fun fact kind of info about this date. Don't specify the given date again just tell the info and stop. THE INFO NEEDS TO BE ACCURATE.";
    let date_info = await model.generateContent(prompt);
    date_info = date_info.response;
    const responseData = {
        date: rand_date.text(),
        info: date_info.text()
    }
    return responseData;
}
async function sendMessageToGemini(msg) {
    let reply = await model.generateContent(msg);
    reply = reply.response.text();
    return reply;
}



async function loginUser(uname, pword) {
    let freshtoken;
    try {
        await mongoclient.connect();
        const userscollection = mongoclient.db("jac").collection("users");
        let user;
        try {
            user = await userscollection.findOne({ "username": uname }, { _id: 0, username: 1, passwordhash: 1, email: 0, authtoken: 0 });
        }
        catch (err) {
            console.log(err);
            return null;
        }
        if (user === null) {
            console.log("User doesn't exist!");
            return null;
        }

        const loginpasshash = crypto.pbkdf2Sync(pword, uname, 1000, 64, `sha512`).toString(`hex`);
        if (user.passwordhash === loginpasshash) {
            freshtoken = crypto.randomBytes(16).toString('hex');
            await userscollection.updateOne({ "username": uname }, { $set: { "authtoken": freshtoken } });
        }
        else {
            console.log("Wrong login pass");
            console.log("Login pass: " + loginpasshash);
            console.log("Correct pass: " + user.passwordhash);
            return null;
        }
    } finally {
        await mongoclient.close();
    }
    return freshtoken;
}
function checkTokenAuthenticity(token) {
}



/*async function mongotest() {
    try {
        await mongoclient.connect();
        const database = mongoclient.db('sample_mflix');
        const movies = database.collection('movies');
        await movies.insertOne({ dsfs: "sdfs" });
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoclient.close();
    }
}*/
