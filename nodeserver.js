const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const url = require("url");
const path = require("path");
const express = require("express");
const app = express();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "calendar.html"));
	run();
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



const portnumber = 3000;
const address = "192.168.56.40";
app.listen(portnumber, address, () => {
    console.log("Server running in address: "+address);
    console.log("Port: "+portnumber);
});



async function run() {
  const prompt = "Pick a date in history VERY RANDOMLY and a fun or factual info related to it. ASSERTING THAT THE INFORMATION SHOULD BE ACCURATELY RELATED WITH THE RANDOMLY CHOSEN DATE. Format for output:<yyyy/mm/dd>;<Information relating the date>";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

