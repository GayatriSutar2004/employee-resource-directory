import { useEffect, useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const handleEmployeeAdded = (employee) => {
    setEmployees((currentEmployees) => [
      ...currentEmployees,
      employee
    ]);
  };

  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === updatedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setEditingEmployee(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete employee");
      }

      setEmployees((currentEmployees) =>
        currentEmployees.filter((employee) => employee.id !== id)
      );

    } catch (error) {
      setError(error.message);
    }
  };

  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) {
      params.append("search", search);
    }

    if (department) {
      params.append("department", department);
    }

    fetch(`http://localhost:5000/api/employees?${params.toString()}`).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      return response.json();
    })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [search, department]);

  if (loading) {
    return <p>Loading employees...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="app">
      <div className="container">

        <h1>Employee Resource Directory</h1>

        <EmployeeForm
          employees={employees}
          onEmployeeAdded={handleEmployeeAdded}
          editingEmployee={editingEmployee}
          onEmployeeUpdated={handleEmployeeUpdated}
        />

        <div className="filters">
          <input
            type="text"
            placeholder="Search employees by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Sales">Sales</option>
          </select>
        </div>

        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>
    </div>
  );
}

export default App;