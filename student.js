const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

/* ================= MONGODB ================= */

mongoose
  .connect(
    "mongodb+srv://bangirihan6_db_11:rihan123@cluster0.rzigrln.mongodb.net/studentDB"
  )
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(3000, () => {
      console.log(
        "Server running on port 3000"
      );
    });
  })
  .catch(err =>
    console.log(err)
  );

/* ================= MODELS ================= */

const userSchema =
  new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,

      enum: [
        "admin",
        "student",
        "faculty",
        "parent"
      ],

      default: "student"
    }
  });

const User =
  mongoose.model(
    "User",
    userSchema
  );

const studentSchema =
  new mongoose.Schema({
    userId: String,

    firstName: String,

    middleName: String,

    lastName: String,

    dob: String,

    gender: String,

    mobile: String,

    currentAddress: String,

    permanentAddress: String,

    studentId: String,

    course: String,

    batch: String,

    admissionDate: String,

    guardianName: String,

    relation: String,

    emergencyContact: String,

    parentEmail: String
  });

const Student =
  mongoose.model(
    "Student",
    studentSchema
  );

/* ================= MIDDLEWARE ================= */

const verifyToken = (
  req,
  res,
  next
) => {
  const token =
    req.headers.authorization;

  if (!token) {
    return res
      .status(403)
      .send("No token");
  }

  try {
    const decoded =
      jwt.verify(
        token,
        "secretkey"
      );

    req.user = decoded;

    next();
  } catch {
    res
      .status(401)
      .send(
        "Invalid token"
      );
  }
};

const isAdmin = (
  req,
  res,
  next
) => {
  if (
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .send(
        "Admin only"
      );
  }

  next();
};

const isFacultyOrAdmin =
  (
    req,
    res,
    next
  ) => {
    if (
      req.user.role !==
        "admin" &&
      req.user.role !==
        "faculty"
    ) {
      return res
        .status(403)
        .send(
          "Faculty/Admin only"
        );
    }

    next();
  };

/* ================= AUTH ================= */

app.post(
  "/register",
  async (
    req,
    res
  ) => {
    try {
      const {
        email,
        password,
        role
      } = req.body;

      if (
        role === "faculty"
      ) {
        return res
          .status(403)
          .send(
            "Faculty can only be created by admin"
          );
      }

      const existing =
        await User.findOne(
          { email }
        );

      if (existing) {
        return res.send(
          "User already exists"
        );
      }

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        new User({
          email,
          password:
            hashed,
          role
        });

      await user.save();

      res.send(
        "Registered successfully"
      );
    } catch (err) {
      res
        .status(500)
        .send(
          err.message
        );
    }
  }
);

app.post(
  "/login",
  async (
    req,
    res
  ) => {
    const {
      email,
      password
    } = req.body;

    try {
      const user =
        await User.findOne(
          { email }
        );

      if (!user) {
        return res
          .status(401)
          .send(
            "Email not found"
          );
      }

      const ok =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!ok) {
        return res
          .status(401)
          .send(
            "Wrong password"
          );
      }

      const token =
        jwt.sign(
          {
            id: user._id,
            role:
              user.role,
            email:
              user.email
          },
          "secretkey"
        );

      res.json({
        token,
        role:
          user.role
      });
    } catch {
      res
        .status(500)
        .send(
          "Login error"
        );
    }
  }
);

/* ================= ADMIN CREATE FACULTY ================= */

app.post(
  "/admin/create-faculty",
  verifyToken,
  isAdmin,
  async (
    req,
    res
  ) => {
    try {
      const {
        email,
        password
      } = req.body;

      const existing =
        await User.findOne(
          { email }
        );

      if (existing) {
        return res
          .status(400)
          .send(
            "Email already exists"
          );
      }

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      const faculty =
        new User({
          email,
          password:
            hashed,
          role:
            "faculty"
        });

      await faculty.save();

      res.send(
        "Faculty account created"
      );
    } catch (err) {
      res
        .status(500)
        .send(
          err.message
        );
    }
  }
);

/* ================= STUDENTS ================= */

app.post(
  "/add",
  verifyToken,
  isFacultyOrAdmin,
  async (
    req,
    res
  ) => {
    try {
      const student =
        new Student(
          req.body
        );

      await student.save();

      res.send(
        student
      );
    } catch (err) {
      res
        .status(500)
        .send(
          err.message
        );
    }
  }
);

app.get(
  "/students",
  verifyToken,
  isFacultyOrAdmin,
  async (
    req,
    res
  ) => {
    const students =
      await Student.find();

    res.send(
      students
    );
  }
);

app.get(
  "/my-data",
  verifyToken,
  async (
    req,
    res
  ) => {
    const data =
      await Student.find(
        {
          userId:
            req.user.id
        }
      );

    res.send(
      data
    );
  }
);

app.get(
  "/parent/my-child",
  verifyToken,
  async (
    req,
    res
  ) => {
    const children =
      await Student.find(
        {
          parentEmail:
            req.user.email
        }
      );

    res.send(
      children
    );
  }
);

app.put(
  "/update/:id",
  verifyToken,
  isAdmin,
  async (
    req,
    res
  ) => {
    const student =
      await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.send(
      student
    );
  }
);

app.delete(
  "/delete/:id",
  verifyToken,
  isAdmin,
  async (
    req,
    res
  ) => {
    await Student.findByIdAndDelete(
      req.params.id
    );

    res.send(
      "Deleted"
    );
  }
);