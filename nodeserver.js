const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const url = require("url");
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const app = express();


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = "mongodb://127.0.0.1:27017/";
const mongoclient = new MongoClient(uri);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "calendar.html"));
});
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "calendar.html"));
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "signup.html"));
});
app.get("/calendar.js", (req, res) => {
    res.sendFile(path.join(__dirname, "calendar.js"));
});
app.get("/popups.js", (req, res) => {
    res.sendFile(path.join(__dirname, "popups.js"));
});
app.get("/calendar.css", (req, res) => {
    res.sendFile(path.join(__dirname, "calendar.css"));
});
app.get("/popups.css", (req, res) => {
    res.sendFile(path.join(__dirname, "popups.css"));
});
app.get("/images/user_account_icon_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "images/user_account_icon_black.png"));
});
app.get("/images/user_account_icon_white.png", (req, res) => {
    res.sendFile(path.join(__dirname, "images/user_account_icon_white.png"));
});
app.get("/images/aichat_icon_black.png", (req, res) => {
    res.sendFile(path.join(__dirname, "images/aichat_icon_black.png"));
});
app.get("/images/aichat_icon_white.png", (req, res) => {
    res.sendFile(path.join(__dirname, "/images/aichat_icon_white.png"));
});


app.post("/signupsubmit", (req, res) => {
    console.log("Request recieved");
    mongotest();
    res.sendFile(path.join(__dirname, "calendar.html"));
});


app.get("/reqtimehop", async (req, res) => {
    console.log("time hop request received");
    const responseFromGemini = await reqtimehopFromGemini().catch((e) => {
        console.error(e);
        process.exit(1);
    });
    const jsonContent = JSON.stringify(responseFromGemini);
    console.log(jsonContent);
    res.send(jsonContent);
});



const portnumber = 3000;
const address = "192.168.56.40";
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


async function mongotest() {
  try {
    mongoclient.connect();
    const database = mongoclient.db('sample_mflix');
    const movies = database.collection('movies');
    await movies.insertOne({dsfs:"sdfs"});
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoclient.close();
  }
}