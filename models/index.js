//This file created relationships between the models.
const User = require("./user");
const Tag = require("./tag");
const Designation = require("./designation")
const Class = require("./class");
const Employee = require("./employee")
const UserGroup = require("./user_group");

//User and employee
User.belongsTo(Employee,{
    foreignKey:"employee_id",
});

//User and user group relation
UserGroup.hasMany(User,{
    foreignKey:"group_id",
});
User.belongsTo(UserGroup,{
    foreignKey:"group_id",
})



//Employee and Designation relation
Designation.hasMany(Employee,{
    foreignKey:"designation_id",
});
Employee.belongsTo(Designation,{foreignKey:"designation_id"});


//Class and Employee relation
Class.belongsTo(Employee,{foreignKey:"employee_id"});


//Class and Tags relation
Class.belongsToMany(Tag,
    {through:"class_tags"},
);
Tag.belongsToMany(Class,
    {through:"class_tags"},
);
