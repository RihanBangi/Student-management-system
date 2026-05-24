import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import StudentForm from "./StudentForm";
import ParentPanel from "./ParentPanel";

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [students, setStudents] = useState([]);
  const [editData, setEditData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("login");

  // Fetch students
const fetchStudents = () => {
  if (!token || !role) return;

  let url = "";

  if (role === "admin") {
    url = "http://localhost:3000/students";
  } else if (role === "parent") {
    url = "http://localhost:3000/parent/my-child";
  } else {
    url = "http://localhost:3000/my-data";
  }

  fetch(url, {
    headers: { Authorization: token }
  })
 .then(res => res.json())
.then(data => {
  setStudents(Array.isArray(data) ? data : []);
})
    .catch(err => {
      console.error(err);
      setStudents([]);
    });
};

  // Edit
  useEffect(() => {
  if (token && role) {
    fetchStudents();
  }
}, [token, role]);

  // Logout
const logout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  setToken(null);
  setRole(null);
  setStudents([]);

  setPage("login");
};
const deleteStudent = async (id) => {
  try {
    await fetch(`http://localhost:3000/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token
      }
    });

    fetchStudents();
  } catch (err) {
    console.error("Delete error:", err);
  }
};

return (
  <>
    {!token ? (
      page === "login" ? (
        <Login
          setToken={setToken}
          setPage={setPage}
          setRole={setRole}
        />
      ) : (
        <Register setPage={setPage} />
      )
    ) : role === "admin" ? (
      <div className="container">
        <h1>Admin Student Panel</h1>

        <button className="logout" onClick={logout}>
          Logout
        </button>

        {editData && (
          <div className="edit-box">
            <h3>Edit Student</h3>

            <input
              placeholder="First Name"
              value={editData.firstName || ""}
              onChange={e =>
                setEditData({
                  ...editData,
                  firstName: e.target.value
                })
              }
            />

            <input
              placeholder="Last Name"
              value={editData.lastName || ""}
              onChange={e =>
                setEditData({
                  ...editData,
                  lastName: e.target.value
                })
              }
            />

            <input
              placeholder="Roll Number"
              value={editData.studentId || ""}
              onChange={e =>
                setEditData({
                  ...editData,
                  studentId: e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 7)
                })
              }
            />

            <input
              placeholder="Course"
              value={editData.course || ""}
              onChange={e =>
                setEditData({
                  ...editData,
                  course: e.target.value
                })
              }
            />

            <button
              className="primary"
              onClick={async () => {
                if (editData.studentId.length > 7) {
                  alert("Roll Number cannot exceed 7 digits");
                  return;
                }

                await fetch(
                  `http://localhost:3000/update/${editData._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token
                    },
                    body: JSON.stringify(editData)
                  }
                );

                setEditData(null);
                fetchStudents();
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        <h2>Student List</h2>

        <ul>
          {students.map(s => (
            <li key={s._id}>
              {s.firstName} {s.lastName} - {s.course}
              <br />

              <button
                className="edit"
                onClick={() => setEditData(s)}
              >
                Edit
              </button>

              <button
                className="delete"
                onClick={() => deleteStudent(s._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : role === "parent" ? (
      <ParentPanel
        students={students}
        logout={logout}
      />
    ) : (
      <div className="container">
        <h1>Student Dashboard</h1>

        <button className="logout" onClick={logout}>
          Logout
        </button>

        {students.length === 0 ? (
          <StudentForm
            token={token}
            refresh={fetchStudents}
          />
        ) : (
          <>
            <h3>My Data</h3>

            <ul>
              {students.map(s => (
                <li key={s._id}>
                  {s.studentId} | {s.firstName}{" "}
                  {s.lastName} - {s.course}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    )}
  </>
);
} 
export default App;