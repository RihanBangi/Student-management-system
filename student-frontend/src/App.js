import React, { useState, useEffect } from "react";
import "./App.css";

import AdminPanel from "./AdminPanel";
import FacultyPanel from "./FacultyPanel";
import Login from "./Login";
import Register from "./Register";
import ParentPanel from "./ParentPanel";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [students, setStudents] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (token) {
      fetchStudents();
    }
  }, [token]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStudents(data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchStudents();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
    setPage("login");
  };

 return (
  <>
    {!token ? (
      page === "login" ? (
        <Login
          setToken={(newToken) => {
            setToken(newToken);
            localStorage.setItem("token", newToken);
          }}
          setRole={(newRole) => {
            setRole(newRole);
            localStorage.setItem("role", newRole);
          }}
          setPage={setPage}
        />
      ) : (
        <Register setPage={setPage} />
      )
    ) : role === "student" ? (
      <div style={{ padding: "30px", color: "white" }}>
        <h2>Student Dashboard</h2>
        <p>Welcome Student</p>
        <button onClick={logout}>Logout</button>
      </div>
    ) : role === "faculty" ? (
      <FacultyPanel
        students={students}
        logout={logout}
        fetchStudents={fetchStudents}
        token={token}
      />
    ) : role === "admin" ? (
      <AdminPanel
        students={students}
        logout={logout}
        editData={editData}
        setEditData={setEditData}
        deleteStudent={deleteStudent}
        fetchStudents={fetchStudents}
        token={token}
      />
    ) : role === "parent" ? (
      <ParentPanel
        students={students}
        logout={logout}
      />
    ) : null}
  </>
);
}

export default App;