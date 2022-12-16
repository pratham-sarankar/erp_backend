//This file created relationships between the models.
const Tag = require("./tag");
const Designation = require("./designation")
const Class = require("./class");
const Employee = require("./employee")



//Employee and Designation relation
Designation.hasMany(Employee,{
    foreignKey:"designation_id",
});
Employee.belongsTo(Designation,{foreignKey:"designation_id"});


//Class and Employee relation
Class.hasOne(Employee,{foreignKey:"class_id"});


//Class and Tags relation
Class.belongsToMany(Tag,
    {through:"class_tags"},
);
Tag.belongsToMany(Class,
    {through:"class_tags"},
);
