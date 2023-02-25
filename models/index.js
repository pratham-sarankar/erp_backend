//This file created relationships between the models.
const User = require("./user");
const Tag = require("./tag");
const Designation = require("./designation")
const Class = require("./class");
const Employee = require("./employee")
const PermissionGroup = require("./permission_group");
const Branch = require("./branch");
const Customer = require("./customer");
const Course = require("./course");
const Payment = require("./payment");
const PaymentMode = require("./payment_mode");
const Module = require("./module");
const Permission = require("./permission");
const Package = require("./package");
const Duration = require("./duration");
const Subscription = require("./subscription");
const Coupon = require("./coupon");
const Batch = require("./batch")

//Branch and employee
Branch.hasMany(Employee, {
    foreignKey: "branch_id",
})
Employee.belongsTo(Branch, {
    foreignKey: "branch_id",
});

//Branch and customer
Branch.hasMany(Customer, {
    foreignKey: "branch_id",
})
Customer.belongsTo(Branch, {
    foreignKey: "branch_id",
});

//Branch and class
Branch.hasMany(Class, {
    foreignKey: "branch_id",
})
Class.belongsTo(Branch, {
    foreignKey: "branch_id",
});

//Branch and course
Branch.hasMany(Course, {
    foreignKey: "branch_id",
})
Course.belongsTo(Branch, {
    foreignKey: "branch_id",

});

//Branch and payment
Branch.hasMany(Payment, {
    foreignKey: "branch_id",
})
Payment.belongsTo(Branch, {
    foreignKey: "branch_id",

});

//Branch and subscription
Branch.hasMany(Subscription, {
    foreignKey: "branch_id",
})
Subscription.belongsTo(Branch, {
    foreignKey: "branch_id",

});

//User and employee
Employee.hasMany(User, {
    foreignKey: "employee_id",
})
User.belongsTo(Employee, {
    foreignKey: "employee_id",
});

//User and user group relation
PermissionGroup.hasMany(User, {
    foreignKey: "group_id",
});
User.belongsTo(PermissionGroup, {
    foreignKey: "group_id",
    constraints: {
        nullable: false,
    }
})


//Employee and Designation relation
Designation.hasMany(Employee, {
    foreignKey: "designation_id",
});
Employee.belongsTo(Designation, {foreignKey: "designation_id"});

//Class and Batch relation
Class.belongsTo(Batch, {foreignKey: "batch_id"});
Batch.hasMany(Class, {foreignKey: "batch_id"});

//Class and Employee relation
Class.belongsTo(Employee, {foreignKey: "trainer_id", as: 'trainer'});


//Class and Tags relation
Class.belongsToMany(Tag, {through: "class_tags"});
Tag.belongsToMany(Class, {through: "class_tags"});

//Class and Package relation
Package.belongsTo(Class, {foreignKey: "class_id"});
Class.hasMany(Package, {foreignKey: "class_id"});

//Package and Duration relation
Duration.hasMany(Package, {foreignKey: "duration_id"});
Package.belongsTo(Duration, {foreignKey: "duration_id"});

//Payment and Payment mode relation
Payment.belongsTo(PaymentMode, {foreignKey: "mode_id"});
PaymentMode.hasMany(Payment, {foreignKey: "mode_id"});

//Payment and customer relation
Payment.belongsTo(Customer, {foreignKey: "customer_id"});
Customer.hasMany(Payment, {foreignKey: "customer_id"});


//Subscription and customer relation
Customer.hasMany(Subscription, {foreignKey: "customer_id"});
Subscription.belongsTo(Customer, {foreignKey: "customer_id"});

//Package and Subscription relation
Package.hasMany(Subscription, {foreignKey: "package_id"});
Subscription.belongsTo(Package, {foreignKey: "package_id"});

//Payment and subscription relation;
Payment.hasMany(Subscription, {foreignKey: "payment_id"})
Subscription.belongsTo(Payment, {foreignKey: "payment_id"});


//Subscription and Coupon relation;
Coupon.hasMany(Subscription, {foreignKey: "coupon_id"});
Subscription.belongsTo(Coupon, {foreignKey: "coupon_id"});


//PermissionGroup and modules relation
PermissionGroup.belongsToMany(Module, {through: Permission, foreignKey: "group_id"});
Module.belongsToMany(PermissionGroup, {through: Permission, foreignKey: "module_id"});
PermissionGroup.hasMany(Permission, {foreignKey: "group_id"});
Permission.belongsTo(PermissionGroup, {foreignKey: "group_id"});
Module.hasMany(Permission, {foreignKey: "module_id"});
Permission.belongsTo(Module, {foreignKey: "module_id"});


// PermissionGroup.hasMany(Module, {foreignKey: "page_id"});
// PermissionGroup.belongsToMany(Module, {through: 'PageWidget', foreignKey: "page_id"});
// Module.belongsToMany(PermissionGroup, {through: 'PageWidget', foreignKey: "widget_id"});
// Module.hasMany(PermissionGroup, {foreignKey: "widget_id"});
// models.PageWidget.belongsTo(models.Page, {foreignKey: "page_id"});
// models.PageWidget.belongsTo(models.Widget, {foreignKey: "widget_id"});