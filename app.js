require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const queryParser = require("./middlewares/query_middlware");
require('dotenv').config();


const indexRouter = require('./routes/index');
const fileRouter = require("./routes/files");
const customerRouter = require('./routes/customers');
const enquiryRouter = require('./routes/enquiry');
const employeeRouter = require('./routes/employees/employees');
const tagRouter = require('./routes/class/tag');
const classRouter = require('./routes/class/class');
const productRouter = require('./routes/products');
const designationRouter = require("./routes/employees/designation");
const userGroupRouter = require("./routes/users/user_group");
const userRouter = require("./routes/users/users");
const branchRouter = require("./routes/branch");
const courseRouter = require("./routes/course");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(queryParser);

//Routers
app.use("/", indexRouter);
app.use("/file", fileRouter);
app.use("/customer", customerRouter);
app.use("/enquiry", enquiryRouter);
app.use("/employee", employeeRouter);
app.use("/tag", tagRouter);
app.use("/designation", designationRouter);
app.use("/class", classRouter);
app.use("/product", productRouter);
app.use("/group", userGroupRouter);
app.use("/user", userRouter);
app.use("/branch", branchRouter);
app.use("/course", courseRouter);


app.use(function (err, req, res, next) {
    console.log(err);
    return res.status(500).json({status: "error", data: err, message: "Internal Server Error."});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: "error",
        data: null,
        message: "Page not found",
    })
});


module.exports = app;
