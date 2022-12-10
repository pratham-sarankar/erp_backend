//This file created relationships between the models.
const Tag = require("./tag");
const Class = require("./class");


Class.belongsToMany(Tag,
    {through:"class_tags"},
);
Tag.belongsToMany(Class,
    {through:"class_tags"},
);
