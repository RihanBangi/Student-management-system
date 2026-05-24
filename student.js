const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());


// ================= CONNECT MONGODB =================
mongoose.connect("mongodb+srv://bangirihan6_db_11:rihan123@cluster0.rzigrln.mongodb.net/studentDB")
.then(() => {
  console.log("MongoDB Connected");

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });

})
.catch(err => console.log(err));


// ================= MODELS =================
//USER
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "student", "faculty", "parent"],
    default: "student"
  }
});

const User = mongoose.model("User", userSchema);
// STUDENT MODEL ✅
const studentSchema = new mongoose.Schema({
  userId: String,

  firstName: String,
  middleName: String,
  lastName: String,
  dob: String,
  gender: String,

 emergencyContact: {
  type: String,
  required: true,
  match: /^[0-9]{10}$/ 
},

  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/   // ✅ exactly 10 digits
  },

  currentAddress: String,
  permanentAddress: String,

  studentId: {
    type: String,
    required: true,
    match: /^[0-9]{7}$/   // ✅ exactly 7 digits
  },

  course: String,
  batch: String,
  admissionDate: String,

  guardianName: String,
  relation: String,
emergencyContact: {
  type: String,
  required: false, 
  match: /^(\+\d{1,3})?[0-9]{10}$/  
},

  parentEmail: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
});
const Student = mongoose.model("Student", studentSchema);


// ================= MIDDLEWARE =================

// TOKEN VERIFY
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(403).send("No token");

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// ADMIN CHECK
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Admin only");
  }
  next();
};


// ================= AUTH ROUTES =================

// REGISTER (EMAIL)
app.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("Email already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    // ❗ Prevent admin creation from frontend
    const allowedRoles = ["student", "faculty", "parent"];
    const userRole = allowedRoles.includes(role) ? role : "student";

    const user = new User({
      email,
      password: hashedPassword,
      role: userRole
    });

    await user.save();

    res.send("User created");
  } catch (err) {
  console.log("SIGNUP ERROR:", err);
  res.status(500).send(err.message);
}
});


// LOGIN (EMAIL)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send("Email not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).send("Wrong password");

const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    email: user.email   // 🔥 IMPORTANT FOR PARENT
  },
  "secretkey"
);

    res.json({
      token,
      role: user.role
    });

  } catch {
    res.status(500).send("Login error");
  }
});


// ================= STUDENT ROUTES =================
//parents
app.get('/parent/my-child', verifyToken, async (req, res) => {
  try {
    const email = req.user.email;

    const children = await Student.find({
      parentEmail: { $regex: new RegExp("^" + email + "$", "i") }
    });

    res.send(children);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// ADD STUDENT
app.post('/add', verifyToken, async (req, res) => {

  try {

    const {
      firstName,
      middleName,
      lastName,
      dob,
      gender,
      email,
      mobile,
      currentAddress,
      permanentAddress,
      studentId,
      course,
      batch,
      admissionDate,
      guardianName,
      relation,
      emergencyContact,
      parentEmail
    } = req.body;

    // ✅ Empty field validation
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !dob ||
      !gender ||
      !email ||
      !mobile ||
      !currentAddress ||
      !permanentAddress ||
      !studentId ||
      !course ||
      !batch ||
      !admissionDate ||
      !guardianName ||
      !relation ||
      !emergencyContact ||
      !parentEmail
    ) {
      return res.status(400).send("Please fill all fields");
    }

    // ✅ Student ID validation
    if (!/^[0-9]{7}$/.test(studentId)) {
      return res.status(400).send("Student ID must be exactly 7 digits");
    }

    // ✅ Mobile validation
    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).send("Mobile must be exactly 10 digits");
    }

    // ✅ Emergency contact validation
    if (!/^[0-9]{10}$/.test(emergencyContact)) {
      return res.status(400).send("Emergency contact must be exactly 10 digits");
    }

    // ✅ Parent email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      return res.status(400).send("Invalid parent email");
    }

    const existing = await Student.findOne({
      userId: req.user.id
    });

    if (existing) {
      return res.status(400).send("Data already exists");
    }

    const student = new Student({
      ...req.body,
      userId: req.user.id
    });

    await student.save();

    res.send(student);

  } catch (err) {
    res.status(500).send(err.message);
  }
});
// MY DATA
app.get('/my-data', verifyToken, async (req, res) => {
  const data = await Student.find({ userId: req.user.id });
  res.send(data);
});

// GET ALL (ADMIN ONLY)
app.get('/students', verifyToken, isAdmin, async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

// UPDATE
app.put('/update/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { studentId, mobile, emergencyContact } = req.body;

    if (!/^[0-9]{7}$/.test(studentId)) {
      return res.status(400).send("Student ID must be 7 digits");
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).send("Mobile must be 10 digits");
    }

    if (!/^[0-9]{10}$/.test(emergencyContact)) {
      return res.status(400).send("Emergency contact must be 10 digits");
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.send(student);

  } catch (err) {
    res.status(500).send(err.message);
  }
});
// DELETE
app.delete('/delete/:id', verifyToken, isAdmin, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});