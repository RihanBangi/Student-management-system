import React, { useEffect, useState } from "react";

function Admin({ token }) {
  const [students, setStudents] = useState([]);

  const fetchStudents = () => {
    fetch("http://localhost:3000/students", {
      headers: {
        Authorization: token
      }
    })
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container">
      <h2>Admin Panel</h2>

      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.name} - {s.age} - {s.course}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;