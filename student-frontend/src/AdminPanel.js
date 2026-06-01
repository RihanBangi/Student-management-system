import React, { useState } from "react";

function AdminPanel({
  students,
  logout,
  editData,
  setEditData,
  deleteStudent,
  fetchStudents,
  token
}) {
  const [facultyEmail, setFacultyEmail] =
    useState("");

  const [
    facultyPassword,
    setFacultyPassword
  ] = useState("");

  const createFaculty = async () => {
    const res = await fetch(
      "http://localhost:3000/admin/create-faculty",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
          Authorization: token
        },

        body: JSON.stringify({
          email: facultyEmail,
          password: facultyPassword
        })
      }
    );

    const data = await res.text();

    alert(data);

    setFacultyEmail("");
    setFacultyPassword("");
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <button
        className="logout"
        onClick={logout}
      >
        Logout
      </button>

      <h3>Create Faculty</h3>

      <input
        placeholder="Faculty Email"
        value={facultyEmail}
        onChange={e =>
          setFacultyEmail(
            e.target.value
          )
        }
      />

      <input
        type="password"
        placeholder="Faculty Password"
        value={facultyPassword}
        onChange={e =>
          setFacultyPassword(
            e.target.value
          )
        }
      />

      <button
        className="primary"
        onClick={createFaculty}
      >
        Create Faculty
      </button>

      {editData && (
        <div className="edit-box">
          <h3>Edit Student</h3>

          <input
            placeholder="First Name"
            value={
              editData.firstName || ""
            }
            onChange={e =>
              setEditData({
                ...editData,
                firstName:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Last Name"
            value={
              editData.lastName || ""
            }
            onChange={e =>
              setEditData({
                ...editData,
                lastName:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Student ID"
            value={
              editData.studentId || ""
            }
            onChange={e =>
              setEditData({
                ...editData,
                studentId:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Course"
            value={
              editData.course || ""
            }
            onChange={e =>
              setEditData({
                ...editData,
                course:
                  e.target.value
              })
            }
          />

          <button
            className="primary"
            onClick={async () => {
              await fetch(
                `http://localhost:3000/update/${editData._id}`,
                {
                  method: "PUT",

                  headers: {
                    "Content-Type":
                      "application/json",
                    Authorization:
                      token
                  },

                  body: JSON.stringify(
                    editData
                  )
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

      <h2>Students</h2>

      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.studentId} |{" "}
            {s.firstName}{" "}
            {s.lastName} -{" "}
            {s.course}

            <br />

            <button
              className="edit"
              onClick={() =>
                setEditData(s)
              }
            >
              Edit
            </button>

            <button
              className="delete"
              onClick={() =>
                deleteStudent(
                  s._id
                )
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;