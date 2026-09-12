const pool = require("../db");

const getEmployees = async (req, res, next) => {
    try {
        const { search, department } = req.query;

        let query = `
            SELECT
                e.id,
                e.name,
                e.email,
                e.department,
                e.role,
                e.manager_id,
                m.name AS manager_name,
                e.status,
                e.created_at
            FROM employees e
            LEFT JOIN employees m
                ON e.manager_id = m.id
        `;

        const conditions = [];
        const values = [];

        if (search) {
            conditions.push("e.name LIKE ?");
            values.push(`%${search}%`);
        }

        if (department) {
            conditions.push("e.department = ?");
            values.push(department);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY e.id";

        const [employees] = await pool.query(query, values);

        res.status(200).json(employees);
    } catch (error) {
        next(error);
    }
};

const createEmployee = async (req, res, next) => {
    try {
        const {
            name,
            email,
            department,
            role,
            manager_id,
            status
        } = req.body;

        // 1. Required field validation
        if (!name || !email || !department || !role) {
            return res.status(400).json({
                message: "Name, email, department and role are required"
            });
        }

        // 2. Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        // 3. Validate status
        if (status && !["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Status must be active or inactive"
            });
        }

        // 4. Validate manager if provided
        if (manager_id !== undefined && manager_id !== null) {
            const [manager] = await pool.query(
                "SELECT id FROM employees WHERE id = ?",
                [manager_id]
            );

            if (manager.length === 0) {
                return res.status(400).json({
                    message: "Manager does not exist"
                });
            }
        }

        // 5. Check for duplicate email
        const [existingEmployee] = await pool.query(
            "SELECT id FROM employees WHERE email = ?",
            [email]
        );

        if (existingEmployee.length > 0) {
            return res.status(400).json({
                message: "An employee with this email already exists"
            });
        }

        // 6. Insert employee
        const [result] = await pool.query(
            `
            INSERT INTO employees
            (name, email, department, role, manager_id, status)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                department,
                role,
                manager_id ?? null,
                status ?? "active"
            ]
        );

        // 7. Return created employee
        const [newEmployee] = await pool.query(
            `
            SELECT
                e.id,
                e.name,
                e.email,
                e.department,
                e.role,
                e.manager_id,
                m.name AS manager_name,
                e.status,
                e.created_at
            FROM employees e
            LEFT JOIN employees m
                ON e.manager_id = m.id
            WHERE e.id = ?
            `,
            [result.insertId]
        );

        res.status(201).json(newEmployee[0]);

    } catch (error) {
        next(error);
    }
};


const getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [employees] = await pool.query(
            `
            SELECT
                e.id,
                e.name,
                e.email,
                e.department,
                e.role,
                e.manager_id,
                m.name AS manager_name,
                e.status,
                e.created_at
            FROM employees e
            LEFT JOIN employees m
                ON e.manager_id = m.id
            WHERE e.id = ?
            `,
            [id]
        );

        if (employees.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(employees[0]);

    } catch (error) {
        next(error);
    }
};

const updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            department,
            role,
            manager_id,
            status
        } = req.body;

        // 1. Check if employee exists
        const [existingEmployee] = await pool.query(
            "SELECT id FROM employees WHERE id = ?",
            [id]
        );

        if (existingEmployee.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // 2. Required field validation
        if (!name || !email || !department || !role) {
            return res.status(400).json({
                message: "Name, email, department and role are required"
            });
        }

        // 3. Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        // 4. Validate status
        if (status && !["active", "inactive"].includes(status)) {
            return res.status(400).json({
                message: "Status must be active or inactive"
            });
        }

        // 5. Validate manager
        if (manager_id !== undefined && manager_id !== null) {
            const [manager] = await pool.query(
                "SELECT id FROM employees WHERE id = ?",
                [manager_id]
            );

            if (manager.length === 0) {
                return res.status(400).json({
                    message: "Manager does not exist"
                });
            }
        }

        // 6. Check duplicate email
        const [duplicateEmail] = await pool.query(
            "SELECT id FROM employees WHERE email = ? AND id != ?",
            [email, id]
        );

        if (duplicateEmail.length > 0) {
            return res.status(400).json({
                message: "An employee with this email already exists"
            });
        }

        // 7. Update employee
        await pool.query(
            `
            UPDATE employees
            SET
                name = ?,
                email = ?,
                department = ?,
                role = ?,
                manager_id = ?,
                status = ?
            WHERE id = ?
            `,
            [
                name,
                email,
                department,
                role,
                manager_id ?? null,
                status ?? "active",
                id
            ]
        );

        // 8. Get updated employee
        const [updatedEmployee] = await pool.query(
            `
            SELECT
                e.id,
                e.name,
                e.email,
                e.department,
                e.role,
                e.manager_id,
                m.name AS manager_name,
                e.status,
                e.created_at
            FROM employees e
            LEFT JOIN employees m
                ON e.manager_id = m.id
            WHERE e.id = ?
            `,
            [id]
        );

        res.status(200).json(updatedEmployee[0]);

    } catch (error) {
        next(error);
    }
};


const deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if employee exists
        const [employee] = await pool.query(
            "SELECT id FROM employees WHERE id = ?",
            [id]
        );

        if (employee.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Delete employee
        await pool.query(
            "DELETE FROM employees WHERE id = ?",
            [id]
        );

        res.status(200).json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};

