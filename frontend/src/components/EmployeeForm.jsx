import { useEffect, useState } from "react";

function EmployeeForm({
    employees,
    onEmployeeAdded,
    editingEmployee,
    onEmployeeUpdated
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        department: "",
        role: "",
        manager_id: "",
        status: "active"
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (editingEmployee) {
            setFormData({
                name: editingEmployee.name,
                email: editingEmployee.email,
                department: editingEmployee.department,
                role: editingEmployee.role,
                manager_id: editingEmployee.manager_id || "",
                status: editingEmployee.status
            });
        }
    }, [editingEmployee]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.department ||
            !formData.role
        ) {
            setError("Please fill all required fields");
            return;
        }

        try {
            const isEditing = Boolean(editingEmployee);

            const url = isEditing
                ? `http://localhost:5000/api/employees/${editingEmployee.id}`
                : "http://localhost:5000/api/employees";

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    manager_id: formData.manager_id
                        ? Number(formData.manager_id)
                        : null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    (isEditing
                        ? "Failed to update employee"
                        : "Failed to add employee")
                );
            }

            if (isEditing) {
                onEmployeeUpdated(data);
            } else {
                onEmployeeAdded(data);
            }

            setFormData({
                name: "",
                email: "",
                department: "",
                role: "",
                manager_id: "",
                status: "active"
            });

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>
                {editingEmployee ? "Edit Employee" : "Add Employee"}
            </h2>

            {error && <p>{error}</p>}

            <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
            />

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />

            <select
                name="department"
                value={formData.department}
                onChange={handleChange}
            >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
            </select>

            <input
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
            />

            <select
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
            >
                <option value="">No Manager</option>

                {employees
                    .filter((employee) => {
                        return !editingEmployee ||
                            employee.id !== editingEmployee.id;
                    })
                    .map((employee) => (
                        <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.role}
                        </option>
                    ))}
            </select>

            <select
                name="status"
                value={formData.status}
                onChange={handleChange}
            >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            <button type="submit">
                {editingEmployee ? "Update Employee" : "Add Employee"}
            </button>
        </form>
    );
}

export default EmployeeForm;