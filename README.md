# Employee Resource Directory

A full-stack Employee Resource Directory built using React, Node.js, Express, and MySQL.

## Features

* Create employees
* View all employees
* Update employee details
* Delete employees
* Search employees by name
* Filter employees by department
* Assign an employee to a manager
* Prevent an employee from selecting themselves as manager
* Manager deletion safely sets subordinate manager to `NULL`
* Backend validation for required fields and email format
* Proper HTTP status codes and centralized error handling
* Loading and error states in the frontend
* Backend API test using Jest and Supertest
* Frontend test using React Testing Library and Jest

## Tech Stack

### Frontend

* React
* Vite
* CSS
* React Testing Library
* Jest

### Backend

* Node.js
* Express.js
* MySQL
* mysql2
* Jest
* Supertest

## Project Structure

```text
employee-resource-directory/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── EmployeeTable.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── App.test.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   │   └── employeeController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── employeeRoutes.js
│   ├── tests/
│   │   └── employee.test.js
│   ├── db.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── database.sql
├── .gitignore
└── README.md
```

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MySQL

## Database Setup

Create the database and tables using the provided SQL file.

From the project root:

```bash
mysql -u root -p < database.sql
```

Alternatively, open the MySQL CLI and run:

```sql
source database.sql;
```

The database created is:

```text
employee_directory
```

## Backend Setup

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_directory
DB_PORT=3306
PORT=5000
```

Start the backend:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at the URL shown by Vite, usually:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/api/employees`     | Get all employees  |
| GET    | `/api/employees/:id` | Get employee by ID |
| POST   | `/api/employees`     | Create employee    |
| PUT    | `/api/employees/:id` | Update employee    |
| DELETE | `/api/employees/:id` | Delete employee    |

### Search and Filter

Employees can be searched by name:

```text
GET /api/employees?search=Priya
```

Employees can also be filtered by department:

```text
GET /api/employees?department=Engineering
```

Both can be used together:

```text
GET /api/employees?search=Priya&department=Engineering
```

## Manager Relationship

The `employees` table uses a self-referencing foreign key:

```text
employees.manager_id → employees.id
```

A top-level manager has:

```text
manager_id = NULL
```

If a manager is deleted, the database uses `ON DELETE SET NULL` so that the subordinate employee is not deleted.

## Validation

The backend validates:

* Required employee fields
* Email format
* Employee email uniqueness
* Manager existence
* Employee status (`active` or `inactive`)

Invalid requests return HTTP `400`.

A request for a non-existing employee returns HTTP `404`.

Unexpected server/database errors are handled by centralized error middleware and return HTTP `500`.

## Testing

### Backend

From the backend directory:

```bash
npm test
```

Backend tests use:

* Jest
* Supertest

### Frontend

From the frontend directory:

```bash
npm test
```

Frontend tests use:

* Jest
* React Testing Library

## Build Frontend

To verify that the production build works:

```bash
npm run build
```
