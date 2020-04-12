const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
require("./utils/Authentication/passport");

const routes = require("./routes");
const users = require("./components/Users/routes");
const projects = require("./components/Projects/routes");
const teams = require("./components/Teams/routes");
const tasks = require("./components/Tasks/routes");
const milestones = require("./components/Milestones/routes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// cloudinary config
cloudinary.config({ cloud_name, api_key, api_secret });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());

// Intialize routes
app.use("/", routes);
app.use("/users", users);
app.use("/projects", projects);
app.use("/teams", teams);
app.use("/tasks", tasks);
app.use("/milestones", milestones);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

module.exports = app;
