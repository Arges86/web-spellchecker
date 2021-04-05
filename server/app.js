const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// const indexRouter = require("./routes/index");
const searchRouter = require("./routes/search");
const dictRouter = require("./routes/dictionary");
const search2Router = require("./routes/search2");
const search3Router = require("./routes/search3");
const languages = require("./routes/languages");

const app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use("/", express.static(path.join(__dirname, "public/dist")));

// app.use("/", indexRouter);
app.use("/search", searchRouter);
app.use("/dictionary", dictRouter);
app.use("/v2/search", search2Router);
app.use("/v3/search", search3Router);
app.use("/languages", languages);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
