const express = require("express");
const router = express.Router();
const EmployeeController = require("../../controllers/employees/employee_controller");
const Controller = require("../../controllers/employees/employee_controller");

router.post("/", Controller.insert);
router.get("/:id", Controller.fetchOne);
router.get("/", Controller.fetchAll);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.destroy);
router.delete("/", Controller.destroyMany);

router.search("/",Controller.search);
module.exports = router;
