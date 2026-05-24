import React, { useState } from "react";

function Dashboard({ token }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");

  const addStudent = async () => {
    await fetch("http://localhost:3000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ name, age, course })
    });

    alert("Student added");
  };

  return (
    <div className="container">
      <h2>User Dashboard</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Age" onChange={e => setAge(e.target.value)} />
      <input placeholder="Course" onChange={e => setCourse(e.target.value)} />

      <button onClick={addStudent}>Add Student</button>
    </div>
  );
}

export default Dashboard;