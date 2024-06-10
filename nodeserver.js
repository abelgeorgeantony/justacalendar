const url = require("url");
const path = require("path");
const express = require("express");
const app = express();


app.get("/",(req, res) => {
    res.sendFile(path.join(__dirname,"calendar.html"));
});
app.get("/home",(req, res) => {
    res.sendFile(path.join(__dirname,"calendar.html"));
});
app.get("/login",(req, res) => {
    res.sendFile(path.join(__dirname,"login.html"));
});
app.get("/signup",(req, res) => {
    res.sendFile(path.join(__dirname,"signup.html"));
});
app.get("/calendar.js",(req, res) => {
    res.sendFile(path.join(__dirname,"calendar.js"));
});
app.get("/calendar.css",(req, res) => {
    res.sendFile(path.join(__dirname,"calendar.css"));
});



const portnumber = 8080;
app.listen(portnumber,() => {
    console.log("Server running on port: "+portnumber);
});