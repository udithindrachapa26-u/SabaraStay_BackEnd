import bcrypt from "bcrypt";
import { db } from "../config/db.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password, contactNo, role } = req.body;

  // 1️⃣ Validation
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  // 2️⃣ Password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  let sql = "";
  let values = [];

  // 3️⃣ Role based insert
  if (role === "student") {
    sql =
      "INSERT INTO students (firstName, lastName, email, password, contactNo) VALUES (?, ?, ?, ?, ?)";
    values = [firstName, lastName, email, hashedPassword, contactNo];
  } else if (role === "owner") {
    sql =
      "INSERT INTO boarding_owners (firstName, lastName, email, password, contactNo) VALUES (?, ?, ?, ?, ?)";
    values = [firstName, lastName, email, hashedPassword, contactNo];
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  // 4️⃣ Execute query
  db.query(sql, values, (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Register successful",
      role: role
    });
  });
};

import jwt from "jsonwebtoken";

// 🔐 LOGIN CONTROLLER
export const login = (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // 2️⃣ First check students table
  const studentSql = "SELECT * FROM students WHERE email = ?";

  db.query(studentSql, [email], async (err, studentResult) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // ✅ Student found
    if (studentResult.length > 0) {
      const student = studentResult[0];

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: student.id, role: "student" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login successful",
        token,
        role: "student",
      });
    }

    // 3️⃣ If not student → check boarding_owners table
    const ownerSql = "SELECT * FROM boarding_owners WHERE email = ?";

    db.query(ownerSql, [email], async (err, ownerResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // ❌ No user found
      if (ownerResult.length === 0) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const owner = ownerResult[0];

      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: owner.id, role: "owner" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        role: "owner",
      });
    });
  });
};