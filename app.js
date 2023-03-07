require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const router = require("./middlewares/router_middleware");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


// app.use(logger("dev"));
logger.token('body', (req, res) => JSON.stringify(req.body));
app.use(logger(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(router(app));

module.exports = app;
