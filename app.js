var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var indexRouter = require("./routes/index");

require("dotenv").config();

var app = express();

// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(
  cors({
    origin: [
      // "https://ksm-uat.mafiincloud.com",
      "https://hwx1l9qw-8080.asse.devtunnels.ms/",
      "http://localhost:8080",
      // "https://hwx1l9qw-8080.asse.devtunnels.ms",
      // "https://gl4wt6xl-8080.asse.devtunnels.ms",
      // "https://gl4wt6xl-8080.asse.devtunnels.ms",
    ],
    credentials: true,
  })
);
app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.set("io", null);

// // this for access io(websocket) in controller
// app.use((req, res, next) => {
//   req.io = app.get("io"); // get with app
//   next();
// });
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", indexRouter);
require("./config/DB");
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
