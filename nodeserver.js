const https = require("https");
var http = require('http');
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");


const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const url = require("url");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const pipeline = require("node:stream/promises");
const crypto = require("crypto");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const flashmodel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const promodel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const BASE_GCALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars";
const BASE_GCALENDAR_ID_FOR_PUBLIC_HOLIDAY = "holiday@group.v.calendar.google.com"; // Calendar Id. This is public but apparently not documented anywhere officialy.
const GCALENDARAPI_KEY = process.env.GOOGLE_CALENDAR_API_KEY;

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
app.get("/shortcuts.js", (req, res) => {
  res.sendFile(path.join(__dirname, "assets/js/shortcuts.js"));
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
  res.sendFile(
    path.join(__dirname, "assets/images/user_account_icon_black.png"),
  );
});
app.get("/user_account_icon_white.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "assets/images/user_account_icon_white.png"),
  );
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
app.get("/shortcuts_icon_black.png", (req, res) => {
  res.sendFile(path.join(__dirname, "assets/images/shortcuts_icon_black.png"));
});
app.get("/shortcuts_icon_white.png", (req, res) => {
  res.sendFile(path.join(__dirname, "assets/images/shortcuts_icon_white.png"));
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
      await userscollection.insertOne({
        username: username,
        passwordhash: passwordhash,
        email: email,
      });
    } catch (err) {
      console.log(err);
      res.status(200).send({ created: false });
      await mongoclient.close();
      return;
    }
    await addDefaultShortcuts(username);
    const authToken = await loginUser(username, req.body.password);
    res.status(200).send({ created: true, authToken: authToken, username: username });
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
    res
      .status(200)
      .send({ authentic: true, authToken: authToken, username: username });
  } catch (err) {
    console.log(err);
    res.status(200).send({ authentic: false });
    await mongoclient.close();
    return;
  } finally {
    await mongoclient.close();
  }
});
app.post("/checktokenauthenticity", urlencodedParser, async (req, res) => {
  console.log("/checktokenauthenticity Request received");
  try {
    await mongoclient.connect();
    const userscollection = mongoclient.db("jac").collection("users");
    try {
      let result = await userscollection.findOne(
        { username: req.body.username },
        { _id: 0, username: 0, passwordhash: 0, email: 0, authtoken: 1 },
      );
      if (result.authtoken === req.body.authToken) {
        res.status(200).send({ authentic: true });
      } else {
        res.status(200).send({ authentic: false });
      }
    } catch (err) {
      console.log(err);
      res.status(200).send({ authentic: false });
      await mongoclient.close();
      return;
    }
  } finally {
    await mongoclient.close();
  }
});
app.post("/fetchspecialdays", urlencodedParser, async (req, res) => {
  console.log("/fetchspecialdays Request received");
  const GCALENDAR_REGION = "en." + req.body.region;
  const viewingyear = Number(req.body.viewingyear);
  console.log(GCALENDAR_REGION);
  console.log(viewingyear);

  const timeMin = new Date(viewingyear + "-01-01");
  const timeMax = new Date((viewingyear + 1) + "-01-01");
  console.log("Searching with timeMin.ISO=" + timeMin.toISOString());
  console.log("Searching with timeMax.ISO=" + timeMax.toISOString());
  const gcalendar_url = (BASE_GCALENDAR_URL + "/" + GCALENDAR_REGION + "%23" + BASE_GCALENDAR_ID_FOR_PUBLIC_HOLIDAY + "/events?key=" + GCALENDARAPI_KEY + "&timeMin=" + timeMin.toISOString() + "&timeMax=" + timeMax.toISOString() + "&singleEvents=true&orderBy=startTime");
  let holidays = [];
  let error = false;
  await fetch(gcalendar_url).then(response => response.json()).then(data => {
    const complexdata = data.items;
    console.log(complexdata.length);
    for (let i = 0; i < complexdata.length; i++) {
      holidays.push({ "name": complexdata[i].summary, "date": complexdata[i].start.date });
    }
  }).catch((e) => {
    console.error(e);
    //process.exit(1);
    error = true;
    res.status(200).send({ holidaysfetchingfailed: true });
  });
  if (!error) {
    res.status(200).send(holidays);
  }
});
app.post("/searchusername", urlencodedParser, async (req, res) => {
  const unametosearch = req.body.uname;
  try {
    await mongoclient.connect();
    const userscollection = mongoclient.db("jac").collection("users");
    const result = await userscollection.findOne(
      { username: unametosearch },
      { _id: 0, username: 1, passwordhash: 0, email: 0 },
    );
    if (result === null) {
      res.status(200).send({ available: true });
    } else {
      res.status(200).send({ available: false });
    }
  } finally {
    await mongoclient.close();
  }
});
app.post("/eventsubmit", urlencodedParser, async (req, res) => {
  console.log("/eventsubmit Request received");
  const daystart = new Date(req.body.date);
  const dayend = new Date(req.body.date + "T23:59Z");

  const uname = req.body.username;
  const datetimeofevent = new Date(req.body.date + "T" + req.body.time + "Z");
  const colorofevent = req.body.color;
  const nameofevent = req.body.name;
  const descriptionofevent = req.body.description;
  try {
    await mongoclient.connect();
    const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
    try {
      const localmaxid_pipeline = [
        {
          $match: {
            $and: [
              { datetime: { $gte: daystart } }, // Replace 'date' with the name of your date attribute
              { datetime: { $lt: dayend } } // Replace 'date' with the name of your date attribute
            ]
          }
        },
        {
          $group: {
            _id: null,
            maxValue: { $max: "$eventid_local" } // Replace 'attribute' with the name of your attribute
          }
        }
      ];
      const localmaxid_result = await eventscollection.aggregate(localmaxid_pipeline).toArray();
      let neweventid_local = 0;
      if (localmaxid_result[0] === undefined) {
        neweventid_local = 1;
      }
      else {
        neweventid_local = Number(localmaxid_result[0].maxValue) + 1;
      }

      const globalmaxid_pipeline = [
        {
          $group: {
            _id: null,
            maxValue: { $max: '$eventid_global' }
          }
        }
      ];
      const globalmaxid_result = await eventscollection.aggregate(globalmaxid_pipeline).toArray();
      let neweventid_global = 0;
      if (globalmaxid_result[0] === undefined) {
        neweventid_global = 1;
      }
      else {
        neweventid_global = Number(globalmaxid_result[0].maxValue) + 1;
      }
      //(await eventscollection.countDocuments()) + 1;
      await eventscollection.insertOne({
        eventid_local: neweventid_local,
        eventid_global: neweventid_global,
        datetime: datetimeofevent,
        color: colorofevent,
        name: nameofevent,
        description: descriptionofevent,
      });
    } catch (err) {
      console.log(err);
      res.status(200).send({ eventadded: false });
      await mongoclient.close();
      return;
    }
    res.status(200).send({ eventadded: true });
  } finally {
    await mongoclient.close();
  }
});
app.delete("/deletesingleevent", urlencodedParser, async (req, res) => {
  console.log("/deletesingleevent Request received");
  const uname = req.body.username;
  const idtodelete = Number(req.body.globalidtodelete);
  console.log(idtodelete);
  try {
    await mongoclient.connect();
    const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
    const result = await eventscollection.deleteOne({ eventid_global: idtodelete });
    console.log(result);
    if (result.deletedCount === 1) {
      res.status(200).send({ deleted: true });
    } else {
      res.status(200).send({ deleted: false });
    }
  } finally {
    await mongoclient.close();
  }
});
app.post("/eventsofdayrequest", urlencodedParser, async (req, res) => {
  console.log("/eventsofdayrequest Request received");
  const uname = req.body.username;
  const daystart = new Date(req.body.date);
  const dayend = new Date(req.body.date + "T23:59Z");

  try {
    await mongoclient.connect();
    const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
    let userevents;
    try {
      userevents = await eventscollection.find({
        $and: [{ datetime: { $gte: daystart } }, { datetime: { $lt: dayend } }]
      }, {
        projection: {
          _id: 0,
          eventid_global: 0
        }
      }).toArray();
    } catch (err) {
      console.log(err);
      res.status(200).send({ eventsfound: false, error: true, eventsfinished: false });
      await mongoclient.close();
      return;
    }
    if ((userevents !== null) && (userevents.length > 0)) {
      res.status(200).send({
        eventsfound: true,
        error: false,
        eventsfinished: true,
        events: userevents
      });
    } else {
      res.status(200).send({ eventsfound: false, error: false, eventsfinished: true });
    }
  } finally {
    await mongoclient.close();
  }
});
app.post("/upcomingeventrequest", urlencodedParser, async (req, res) => {
  console.log("/upcomingeventrequest Request received");
  const uname = req.body.username;
  const curr_datetime = new Date(req.body.currentdate + "T" + req.body.currenttime + "Z");

  try {
    await mongoclient.connect();
    const eventscollection = mongoclient.db("jac_events").collection(uname + "events");
    let userevents;
    try {
      userevents = await eventscollection.find({
        datetime: { $gte: curr_datetime }
      }, {
        projection: {
          _id: 0,
          eventid_local: 0
        }
      }).toArray();
    } catch (err) {
      console.log(err);
      res.status(200).send({ eventsfound: false, error: true, eventsfinished: false });
      await mongoclient.close();
      return;
    }
    if ((userevents !== null) && (userevents.length > 0)) {
      res.status(200).send({
        eventsfound: true,
        error: false,
        eventsfinished: true,
        events: userevents
      });
    } else {
      res.status(200).send({ eventsfound: false, error: false, eventsfinished: true });
    }
  } finally {
    await mongoclient.close();
  }
});
app.post("/aichathistoryrequest", urlencodedParser, async (req, res) => {
  console.log("/aichathistoryrequest Request received");
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
      } else {
        lastsentid = lastsentid - 1;
      }
      singlechat = await chatscollection.findOne({
        chatid_global: { $eq: lastsentid },
      });
      //console.log(singlechat);
    } catch (err) {
      console.log(err);
      res.status(200).send({ chatfound: false, error: true, chatsfinished: false });
      await mongoclient.close();
      return;
    }
    if (singlechat !== null) {
      res.status(200).send({
        chatfound: true,
        error: false,
        chatsfinished: false,
        chatid: singlechat.chatid_global,
        datetime: singlechat.datetime,
        chatinitby: singlechat.chatinitby,
        usermsg: singlechat.usermsg,
        aimsg: singlechat.aimsg,
      });
    } else {
      res
        .status(200)
        .send({ chatfound: false, error: false, chatsfinished: true });
    }
  } finally {
    await mongoclient.close();
  }
});

app.post("/aichatmsgsubmit", urlencodedParser, async (req, res) => {
  console.log("/aichatmsgsubmit Request received");
  const daystart = new Date(req.body.date);
  const dayend = new Date(req.body.date + "T23:59Z");

  const uname = req.body.username;
  const msg = req.body.message;
  const datetimeofmsg = new Date(req.body.date + "T" + req.body.time + "Z");
  const replyFromGemini = await sendMessageToGemini(msg).catch((e) => {
    console.error(e);
    //process.exit(1);
    return;
  });

  res.status(200).send({ reply: replyFromGemini });
  //console.log(replyFromGemini);

  const replymsg = replyFromGemini.split(";")[0];

  try {
    await mongoclient.connect();
    const chatscollection = mongoclient
      .db("jac_aichats")
      .collection(uname + "aichats");
    try {
      const newchatid_global = (await chatscollection.countDocuments()) + 1;
      const newchatid_local =
        (await chatscollection
          .find({
            $and: [
              { datetime: { $gt: daystart } },
              { datetime: { $lt: dayend } },
            ],
          })
          .count()) + 1;
      await chatscollection.insertOne({
        chatid_global: newchatid_global,
        chatid_local: newchatid_local,
        datetime: datetimeofmsg,
        chatinitby: "user",
        usermsg: msg,
        aimsg: replymsg,
      });
    } catch (err) {
      console.log(err);
      //res.status(200).send({ "eventfound": false, "error": true, "eventsfinished": false });
      await mongoclient.close();
      return;
    }
  } finally {
    await mongoclient.close();
  }
});

app.post("/saveshortcut", urlencodedParser, async (req, res) => {
  console.log("/saveshortcut Request received");
  const uname = req.body.username;
  console.log(uname);
  const keynamefromclient = req.body.keyname;
  const keyvaluefromclient = req.body.keyvalue;
  try {
    await mongoclient.connect();
    const shortcutscollection = mongoclient.db("jac_shortcuts").collection(uname + "shortcuts");
    try {
      const newshortcutid = (await shortcutscollection.countDocuments()) + 1;
      await shortcutscollection.insertOne({
        shortcutid: newshortcutid,
        keyname: keynamefromclient,
        keyvalue: keyvaluefromclient,
      });
    } catch (err) {
      console.log(err);
      res.status(200).send({ shortcutadded: false });
      await mongoclient.close();
      return;
    }
    res.status(200).send({ shortcutadded: true });
  } finally {
    await mongoclient.close();
  }
});
app.post("/shortcutsrequest", urlencodedParser, async (req, res) => {
  console.log("/shortcutsrequest Request received");
  const uname = req.body.username;
  const lastsentscid = Number(req.body.lastreceived_sc_id);
  //console.log(uname);
  //console.log(lastsentscid);
  try {
    await mongoclient.connect();
    const shortcutscollection = mongoclient
      .db("jac_shortcuts")
      .collection(uname + "shortcuts");
    let usershortcut;
    try {
      usershortcut = await shortcutscollection.findOne({
        shortcutid: { $gt: lastsentscid },
      });
    } catch (err) {
      console.log(err);
      res
        .status(200)
        .send({ shortcutfound: false, error: true, shortcutsfinished: false });
      await mongoclient.close();
      return;
    }
    //console.log(usershortcut);
    if (usershortcut !== null) {
      //console.log("shortcut found");
      res.status(200).send({
        shortcutfound: true,
        error: false,
        shortcutsfinished: false,
        shortcutid: usershortcut.shortcutid,
        keyname: usershortcut.keyname,
        keyvalue: usershortcut.keyvalue,
      });
    } else {
      res
        .status(200)
        .send({ shortcutfound: false, error: false, shortcutsfinished: true });
    }
  } finally {
    await mongoclient.close();
  }
});


app.post("/brewshortcutusingai", urlencodedParser, async (req, res) => {
  console.log("/brewshortcutusingai Request received");
  const description = req.body.description;
});



app.get("/aisearchsuggest", async (req, res) => {
  console.log("/aisearchsuggest Request received");
  const prompt =
    'I have a calendar app. A user has entered a query that isn\'t complete(partial query) into a searchbar in my app. Consider yourself a searchbar and try to complete the partial query that the user has entered. Be careful to structure the suggestions such that they are logical and related to the partial query as much as possible. Limit yourself to generating a maximum of 11 completions for the partial query. Don\'t generate anything else, generate only completions seperated with a semicolon ";" also donot use seperators like newline anywhere in your output. 2 consecutive semicolons ";;" will mark the end of the 11 completions. An example output:g1;2;g3,...,g11;; The partial query:';
  const partialsearch = req.query.partiallysearched;
  console.log("partialsearch: " + partialsearch);
  const completeprompt = prompt + partialsearch;
  const result = await flashmodel.generateContentStream([completeprompt]);

  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
  });
  for await (const chunk of result.stream) {
    console.log(chunk.text() + "1");
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



/*const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/justacalendar.online/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/justacalendar.online/fullchain.pem"),
};
https.createServer(options, app).listen(443, function (req, res) {
  console.log("HTTPS Server started at port " + 443);
});*/
//const httpApp = express();
http.createServer(app).listen(80, () => console.log(`HTTP server listening: http://localhost`));
/*httpApp.get("*", function(req, res, next) {
  res.redirect("https://" + req.headers.host + req.path);
});*/



async function reqtimehopFromGemini() {
  const prompt = "You are going to be a 'random history' bot. Pick a date very randomly ranging from the year 1500 to 2024. Tell a fact or fun fact kind of info about this date. Don't specify the choosen date again just tell the info and stop. THE INFO NEEDS TO BE VERY ACCURATE AND SHOULDN'T BE A LONG EXPLANATION. Give output in the format: 'YYYY/MM/DD;information about the date;;' Use a single semicolon to specify the end of the date and 2 consecutive semicolons to specify the end of the whole respone.";
  let content = await flashmodel.generateContent(prompt);
  console.log(content.response.text());
  const dateandinfo = content.response.text();
  const rdate = dateandinfo.split(";")[0];
  const rinfo = dateandinfo.split(";")[1];
  console.log(rinfo);
  const responseData = {
    date: rdate,
    info: rinfo
  };
  return responseData;
}

const searchaifunctions_list = [
  { function_name: "updatedate", example_call: "updatedate(2024, 3, 12)", function_description: "This function call will update the calendar display to a specified date. The dates are specified by passing in the parameters - year, monthindex, date. The monthindex is like a 0 based array indexing. January is 0 and December is 11. Passing in null for all 3 arguments will update to the current date of the device." },
  { function_name: "updatedate", example_call: "updatedate(2024, 3, 12)", function_description: "This function call will update the calendar display to a specified date. The dates are specified by passing in the parameters - year, monthindex, date. The monthindex is like a 0 based array indexing. January is 0 and December is 11. Passing in null for all 3 arguments will update to the current date of the device." },
];
const chataifunctions_list = [
  { function_name: "closeWindow", example_call: "closeWindow()", function_description: "The chat between the user and you takes place in a window that is started by stopping the calendar display, So for the calendar display to start working again your window should be closed. The calendar display is simply just a space where the dates and week names of a month are shown. Nothing else is in the calendar display. If there are any functions that require you to use the calendar display then you have to close your window first!. Just a suggestion that if the user is simply just asking like 'when did Gandhi die', It would be better to tell the date directly rather than taking the user to the date in calendar display. If you are closing the window to satisfy the user's need, then it is a good idea to first say to the user a message like 'Sure, I will show you the date', then add a delay of atleast 3 seconds using setTimer() to close the window so that the user can read any reply you have sent and have a seamless experience. The function takes no arguments." },
  { function_name: "updatedate", example_call: "updatedate(2000, 0, 1)", function_description: "This function call will set a variable that specifies the date that the calendar display and the app is currently pointing to. Some uses of setting this variable: making the calendar display point to the set date(If you want the calendar display to work you have to first close your window, otherwise you will only be setting the date variable), when opening the events popup the day for which events should be shown is decided from this variable. The date is specified by passing in the parameters - year, monthindex, date. The monthindex is like a 0 based array indexing. January is 0 and December is 11. Passing in null for all 3 arguments will update to the current date of the device." },
  { function_name: "sendMessageToUser", example_call: "sendMessageToUser('Hello user')", function_description: "This function call will send a seperate message to the user. Don't repeat the message in your standard reply in this function call. The argument is required. The argument will be sent as the message to the user. The message should be enclosed in a pair of single quote(') like you would enclose a string in js. Donot use double quote to enclose the message as it will break parsing." },
  { function_name: "showeventpopup", example_call: "showeventpopup('addanevent',null)", function_description: "This call will open a single day events related popup. The first argument specifies the mode of the popup. If you give 'addanevent' as the first parameter's value, then it will open the popup in event adding mode. Essentially it opens a popup that the user can use to add an event. Another possible value for it is, 'eventslist' which opens the popup in the mode that shows the events of a specified date. To specify a date you have to set date variable using updatedate(). Another possible value is 'infobyai' which you probably will never use. It just shows information about the date using AI, Which currently doesn't work. Don't worry about the second parameter just keep it as null"},
  { function_name: "fillEventAdder", example_call: "fillEventAdder('2026-03-01', '16:20', 'name of event', 'description of event', '#ff0000')", function_description: "This function call will fill the fields of the event adding popup. First argument is the date. Date format should be: 'YYYY-MM-DD'. Second argument is the time of the event. It should be in the 24hr format without specifying the meridian. Format: 'HH:MM'. Third argument is the name of the event. Fourth argument is the description of the event. Fifth argument is the color that may notate the event some places. The color format should be in the hex numer format that specifies rgb. Format: '#000000'."},
  { function_name: "sendMessageToAi", example_call: "sendMessageToAi('Hello AI')", function_description: "USE THIS function ONLY IF you want to message yourself. This function call will send a message to you(Gemini AI). You are not the user, this function is mainly meant for the user to use. So use this only if the user really needs this. It is a potential recursion, Recursion is complex and bad, but useful. Use it only if needed. The argument is optional. If you give an argument it will be sent as the message to you(Gemini AI), if not the value in the message typing box will be sent. The message should be enclosed in a pair of single quote(') like you would enclose a string in js. Donot use double quote to enclose the message as it will break parsing." },
  { function_name: "setTimer", example_call: "setTimer(5, sendMessageToUser.bind(null, 'hello'))", function_description: "This function call will set a background timer for the specified seconds that's passed in as the first parameter and will execute the callback that's passed in as the second parameter. It can also be said that this call will set a delay befor the callback will be executed. If there are arguments that should be passed to the callback then the bind() function should be used like in the example, the first argument of bind() is always null and then the parameters which the callback need should be passed. If there are no parameters for the callback then only the name of the callback function should be specified." },
];
async function sendMessageToGemini(msg) {
  let appinfo = "Anything you say or the functions you choose will directly be sent to the user so chat to the user, not to me."
    + "I hava a calendar app. You are integrated as a chatbot/assistant in the app."
    + "I am giving you the ability to interact with the app by exposing the names and "
    + "descriptions of some JS functions in the app to you. The functions will be "
    + "exposed in the format: "
    + "function_name: nameofafunction1, example_call: nameofafunction1(args), function_description: 'a sentence that describes the function'; "
    + "function_name: nameofafunction2, example_call: nameofafunction2(args), function_description: 'a sentence that describes the function';;. "
    + "The individual details about each function is seperated by a comma and each function is seperated by a semicolon. "
    + "Atlast two consecutive semicolons will declare the end of information about the functions you can use. "
    + "The actual functions you can use are: ";

  for (let i = 0; i < chataifunctions_list.length; i++) {
    appinfo = appinfo + "function_name: " + chataifunctions_list[i].function_name + ", ";
    appinfo = appinfo + "example_call: " + chataifunctions_list[i].example_call + ", ";
    appinfo = appinfo + "function_description: '" + chataifunctions_list[i].function_description + "'; ";
  }
  appinfo = appinfo.slice(0, appinfo.length - 1) + ";";
  appinfo = appinfo + "So these are the functions that you can use. Don't expose these functions to the user. "
    + "Whenever you feel like the user is asking/telling you to do some task in the app, "
    + "you need to select some functions from the ones I taught you to perform those tasks. "
    + "After selecting the functions you have to construct the function calls logically "
    + "like how you would write a script that already has the functions predefined. "
    + "You just have to call them. Now for the format of output, First analyse the "
    + "user's message and if it requires the use of functions select the functions "
    + "logically. First write the response to the user, then seperated by two consecutive "
    + "semicolons specify the function calls in the order they should be executed. "
    + "Also end your whole response with 2 consecutive semicolons. Don't use single quote in the response, only use it for marking arguments. Format for output: "
    + "Message to the user;;function1();function2('arg');;. If you feel like the user didn't ask you for any service and that you don't need to use the functions then don't use the functions. Just put null if you didn't choose any functions.";

  appinfo = appinfo + "That is all the instructions I have for you. The user has sent a message to you. I want you to analyse it and respond to it accordingly to how I instructed. I reapeat you are not talking to me so don't say anything to me you are only instructed to chat to the user. I will never be able to send the following message. So it is not from me but the user: ";
  console.log(appinfo + msg)
  console.log(appinfo.length);
  const prompt = appinfo + "'" + msg + "'";
  let reply = await flashmodel.generateContent(prompt);
  reply = reply.response.text();
  console.log(reply);
  return reply;
}

async function loginUser(uname, pword) {
  let freshtoken;
  try {
    await mongoclient.connect();
    const userscollection = mongoclient.db("jac").collection("users");
    let user;
    try {
      user = await userscollection.findOne(
        { username: uname },
        { _id: 0, username: 1, passwordhash: 1, email: 0, authtoken: 0 },
      );
    } catch (err) {
      console.log(err);
      return null;
    }
    if (user === null || user === undefined) {
      console.log("User doesn't exist!");
      return null;
    }

    const loginpasshash = crypto
      .pbkdf2Sync(pword, uname, 1000, 64, `sha512`)
      .toString(`hex`);
    if (user.passwordhash === loginpasshash) {
      freshtoken = crypto.randomBytes(16).toString("hex");
      await userscollection.updateOne(
        { username: uname },
        { $set: { authtoken: freshtoken } },
      );
    } else {
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

const defaultshortcuts = [
  { keyname: "sc_btnname_gotocurrentdate", keyvalue: "Current Date" },
  { keyname: "sc_fncall_gotocurrentdate", keyvalue: "closeWindow();updatedate(null,null,null);" },
  { keyname: "sc_btnname_addanevent", keyvalue: "Add An Event" },
  { keyname: "sc_fncall_addanevent", keyvalue: "showeventpopup('addanevent'\,'showeventwindow');" },
];
async function addDefaultShortcuts(uname) {
  try {
    await mongoclient.connect();
    const shortcutscollection = mongoclient.db("jac_shortcuts").collection(uname + "shortcuts");
    for (let i = 0; i < defaultshortcuts.length; i++) {
      const dkeyname = defaultshortcuts[i].keyname;
      const dkeyvalue = defaultshortcuts[i].keyvalue;
      try {
        const newshortcutid = (await shortcutscollection.countDocuments()) + 1;
        await shortcutscollection.insertOne({
          shortcutid: newshortcutid,
          keyname: dkeyname,
          keyvalue: dkeyvalue,
        });
      } catch (err) {
        console.log(err);
        //await mongoclient.close();
      }
    }
  } finally {
    await mongoclient.close();
  }
}
