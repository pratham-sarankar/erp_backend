const indexRouter = require("../routes");
const fileRouter = require("../routes/files");
const customerRouter = require("../routes/customers");
const enquiryRouter = require("../routes/enquiry");
const employeeRouter = require("../routes/employees/employees");
const tagRouter = require("../routes/class/tag");
const designationRouter = require("../routes/employees/designation");
const classRouter = require("../routes/class/class");
const productRouter = require("../routes/products");
const permissionGroupRouter = require("../routes/users/permission_group");
const userRouter = require("../routes/users/users");
const branchRouter = require("../routes/branch");
const courseRouter = require("../routes/course");
const paymentRouter = require("../routes/payments");

function router(app) {
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
    app.use("/permission-group", permissionGroupRouter);
    app.use("/user", userRouter);
    app.use("/branch", branchRouter);
    app.use("/course", courseRouter);
    app.use("/payment",paymentRouter);

    //Error handler
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
    return function router(req, res, next) {
        next();
    }
}

module.exports = router;