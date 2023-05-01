const express = require("express");
require("dotenv").config();
const serverConnection = require("./src/db/server");
const passport = require("passport");
// const googleCred = require("./src/config/google");
const flash = require("express-flash");
const session = require("express-session");
require("./src/config/passport");
require("./src/config/google");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const app = express();
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
serverConnection();
app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "secr3t",
    resave: false,
    saveUninitialized: false,
  })
);

/**With Passport.js we can communicate back to the user when their credentials are rejected using flash messages */
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// app.use(googleCred);
app.use(cookieParser());

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    successRedirect: "/profile",
    failureFlash: true,
    successFlash: "Successfully logged in!",
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, function () {
  console.log("SaaSBase Authentication Server listening on port 3000");
});
