const express = require("express");

const {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", getEmployees);

router.post("/", createEmployee);

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

module.exports = router;