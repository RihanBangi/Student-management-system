import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function StudentForm({ token, refresh }) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    mobile: "",
    currentAddress: "",
    permanentAddress: "",
    studentId: "",
    course: "",
    batch: "",
    admissionDate: "",
    guardianName: "",
    relation: "",
    emergencyContact: "",
    parentEmail: "",
  });
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);

      setForm(prev => ({
        ...prev,
        email: decoded.email
      }));
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  

const submit = async () => {

  // ✅ Empty field validation
  if (
    !form.firstName ||
    !form.middleName ||
    !form.lastName ||
    !form.dob ||
    !form.gender ||
    !form.email ||
    !form.mobile ||
    !form.currentAddress ||
    !form.permanentAddress ||
    !form.studentId ||
    !form.course ||
    !form.batch ||
    !form.admissionDate ||
    !form.guardianName ||
    !form.relation ||
    !form.emergencyContact ||
    !form.parentEmail
  ) {
    alert("Please fill all fields");
    return;
  }

  // ✅ Student ID validation
  if (!/^[0-9]{7}$/.test(form.studentId)) {
    alert("Student ID must be exactly 7 digits");
    return;
  }

  // ✅ Mobile validation
  if (!/^[0-9]{10}$/.test(form.mobile)) {
    alert("Mobile number must be exactly 10 digits");
    return;
  }

  // ✅ Emergency contact validation
  if (!/^[0-9]{10}$/.test(form.emergencyContact)) {
    alert("Emergency contact must be exactly 10 digits");
    return;
  }

  // ✅ Parent email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
    alert("Enter valid parent email");
    return;
  }

  // ✅ Save data
  await fetch("http://localhost:3000/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify(form)
  });

  alert("Data saved");
  refresh();
};
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div>
      <h2>Student Details</h2>

      <input name="firstName" placeholder="First Name" onChange={handleChange} />
      <input name="middleName" placeholder="Middle Name" onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />

      <input type="date" name="dob" onChange={handleChange} />

      <select name="gender" onChange={handleChange}>
        <option>Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input value={form.email} placeholder="Email" readOnly />     
     <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={e =>setForm({...form,mobile: e.target.value.replace(/\D/g, "").slice(0, 10)})}/>

      <input name="currentAddress" placeholder="Current Address" onChange={handleChange} />
      <input name="permanentAddress" placeholder="Permanent Address" onChange={handleChange} />

      <input name="studentId" placeholder="Student ID"
       value={form.studentId}
       onChange={e =>
      setForm({
      ...form,
      studentId: e.target.value.replace(/\D/g, "").slice(0, 7)
    })
  }
/>
      <input name="course" placeholder="Course" onChange={handleChange} />
      <input name="batch" placeholder="Batch" onChange={handleChange} />
      <input type="date" name="admissionDate" onChange={handleChange} />

      <input name="guardianName" placeholder="Guardian Name" onChange={handleChange} />
      <input name="relation" placeholder="Relation" onChange={handleChange} />
<input
  name="emergencyContact"
  placeholder="Emergency Contact"
  value={form.emergencyContact}
  onChange={(e) =>
    setForm({
      ...form,
      emergencyContact: e.target.value.replace(/\D/g, "").slice(0, 10)
    })
  }
/>
     <input
  name="parentEmail"
  placeholder="Parent Email"
  onChange={handleChange}
/>

      <button onClick={submit}>Save</button>
    </div>
  );
}

export default StudentForm;
