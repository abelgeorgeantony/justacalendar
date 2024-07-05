const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const url = require("url");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
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
app.get("/calendar.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/calendar.js"));
});
app.get("/popups.js", (req, res) => {
    res.sendFile(path.join(__dirname, "assets/js/popups.js"));
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
    console.log("signup Request recieved");
    console.log(req.body);
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
            return;
        }
        const authToken = await loginUser(username, req.body.password);
        console.log("authToken: " + authToken);
        res.status(200).send({ "created": true, "authToken": authToken, "username": username });
    } finally {
        await mongoclient.close();
    }
});
app.post("/loginsubmit", urlencodedParser, async (req, res) => {
    console.log("login Request recieved");
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    try {
        const authToken = await loginUser(username, password);
        console.log("authToken: " + authToken);
        res.status(200).send({ "authentic": true, "authToken": authToken, "username": username });
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ "authentic": false });
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
            console.log("Authtoken in db:" + result.authtoken);
            console.log("Authtoken given:" + req.body.authToken);
            if (result.authtoken === req.body.authToken) {
                res.status(200).send({ "authentic": true });
            }
            else {
                res.status(200).send({ "authentic": false });
            }
            return;
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "authentic": false });
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
        console.log(result);
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
    const uname = req.body.username;
    const dateofevent = req.body.date;
    const nameofevent = req.body.name;
    const descriptionofevent = req.body.description;
    try {
        await mongoclient.connect();
        const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
        try {
            await eventscollection.insertOne({ "date": dateofevent, "name": nameofevent, "description": descriptionofevent });
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "eventadded": false });
            return;
        }
        res.status(200).send({ "eventadded": true });
    } finally {
        await mongoclient.close();
    }
});
app.post("/eventrequest", urlencodedParser, async (req, res) => {
    const uname = req.body.username;
    const dateofevent = req.body.date;
    const idtofind_integer = (Number(req.body.lastreceivedeventid)+1);
    const idtofind = idtofind_integer.toString(16);

    try {
        await mongoclient.connect();
        const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
        let userevent;
        try {
            if((idtofind_integer-1) !== 0) {
                userevent = await eventscollection.findOne({"_id": idtofind, "date": dateofevent}, { _id: 0, date: 0, name: 1, description: 1 });
            }
            else {
                userevent = await eventscollection.findOne({"date": dateofevent}, { _id: 1, date: 0, name: 1, description: 1 });
            }
            console.log(userevent);
        }
        catch (err) {
            console.log(err);
            res.status(200).send({ "eventadded": false });
            return;
        }
        res.status(200).send({ "eventadded": true });
    } finally {
        await mongoclient.close();
    }
});

app.get("/reqtimehop", async (req, res) => {
    const responseFromGemini = await reqtimehopFromGemini().catch((e) => {
        console.error(e);
        process.exit(1);
    });
    const jsonContent = JSON.stringify(responseFromGemini);
    console.log(jsonContent);
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
