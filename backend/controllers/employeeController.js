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

module.exports = {
    getEmployees
};