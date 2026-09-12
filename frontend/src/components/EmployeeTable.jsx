function EmployeeTable({ employees, onEdit, onDelete }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Manager</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                {employees.map((employee) => (
                    <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.department}</td>
                        <td>{employee.role}</td>
                        <td>{employee.manager_name || "—"}</td>
                        <td>{employee.status}</td>

                        <td>
                            <button onClick={() => onEdit(employee)}>
                                Edit
                            </button>

                            <button onClick={() => onDelete(employee.id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default EmployeeTable;