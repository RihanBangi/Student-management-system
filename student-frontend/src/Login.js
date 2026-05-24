import React, { useState } from "react";
import "./App.css";

function Login({ setToken, setPage, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      // ❗ check if login failed
      if (!res.ok) {
        alert("Wrong credentials");
        return;
      }

      const data = await res.json();

      // ✅ Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      setToken(data.token);
      setRole(data.role); // ✅ IMPORTANT

    } catch (err) {
      alert("Server error");
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <p
        onClick={() => setPage("register")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        New user? Register here
      </p>
    </div>
  );
}

export default Login;