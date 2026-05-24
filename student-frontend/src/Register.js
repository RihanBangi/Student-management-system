import React, { useState } from "react";
import "./App.css";

function Register({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const register = async () => {
    try {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role })
      });

      if (!res.ok) {
        alert("Error creating user");
        return;
      }

      alert("Registered successfully");
      setPage("login");

    } catch (err) {
      alert("Server error");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      {/* ROLE SELECT */}
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
        <option value="parent">Parent</option>
      </select>

      <button onClick={register}>Register</button>

      <p
        onClick={() => setPage("login")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;