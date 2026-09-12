CREATE DATABASE IF NOT EXISTS employee_directory;

USE employee_directory;

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    department VARCHAR(50) NOT NULL,

    role VARCHAR(50) NOT NULL,

    manager_id INT NULL,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_employee_manager
        FOREIGN KEY (manager_id)
        REFERENCES employees(id)
        ON DELETE SET NULL
);
