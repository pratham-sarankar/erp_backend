const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
require('dotenv').config();


const indexRouter = require('./routes/index');
const customerRouter = require('./routes/customers');

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/customer", customerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: "error",
        data: null,
        message: "Page not found",
    })
});

module.exports = app;
