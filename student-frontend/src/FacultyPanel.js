import React, { useState } from "react";

function FacultyPanel({
  students,
  logout,
  fetchStudents,
  token
}) {
  const [studentId, setStudentId] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [course, setCourse] =
    useState("");

  const addStudent = async () => {
    const res = await fetch(
      "http://localhost:3000/add",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
          Authorization: token
        },

        body: JSON.stringify({
          studentId,
          firstName,
          lastName,
          course
        })
      }
    );

    const data = await res.text();

    alert(data);

    setStudentId("");
    setFirstName("");
    setLastName("");
    setCourse("");

    fetchStudents();
  };

  return (
    <div className="container">
      <h1>Faculty Dashboard</h1>

      <button
        className="logout"
        onClick={logout}
      >
        Logout
      </button>

      <h3>Add Student</h3>

      <input
        placeholder="Student ID"
        value={studentId}
        onChange={e =>
          setStudentId(
            e.target.value
          )
        }
      />

      <input
        placeholder="First Name"
        value={firstName}
        onChange={e =>
          setFirstName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={e =>
          setLastName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Course"
        value={course}
        onChange={e =>
          setCourse(
            e.target.value
          )
        }
      />

      <button
        className="primary"
        onClick={addStudent}
      >
        Add Student
      </button>

      <h2>Students</h2>

      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.studentId} |{" "}
            {s.firstName}{" "}
            {s.lastName} -{" "}
            {s.course}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FacultyPanel;