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