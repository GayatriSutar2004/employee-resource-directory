const request = require("supertest");
const app = require("../server");
const pool = require("../db");

describe("Employee API", () => {

    test("should return 400 when required fields are missing", async () => {
        const response = await request(app)
            .post("/api/employees")
            .send({
                email: "test@company.com"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe("Name, email, department and role are required");
    });

    afterAll(async () => {
        await pool.end();
    });

});