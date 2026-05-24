import React from "react";

function ParentPanel({ students, logout }) {
  return (
    <div className="container">
      <h1>Parent Dashboard</h1>

      <button className="logout" onClick={logout}>
        Logout
      </button>

      <h3>My Child Data</h3>

      {students.length > 0 ? (
        <ul>
          {students.map(s => (
            <li key={s._id}>
              {s.studentId} | {s.firstName} {s.lastName} - {s.course}
            </li>
          ))}
        </ul>
      ) : (
        <p>No child data found</p>
      )}
    </div>
  );
}

export default ParentPanel;