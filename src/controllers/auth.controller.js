import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const createPasswordResetsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      role ENUM('student', 'owner') NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      used TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX (email),
      INDEX (token)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
  await db.promise().query(sql);
};

export const register = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, contactNo, role } = req.body;

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

  // Validation
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (!passwordPattern.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
    });
  }

  // Password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  let sql = "";
  let values = [];

  // Role based insert
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

  // Execute query
  db.query(sql, values, (err) => {
    if (err) {
      console.error("Register DB error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already registered" });
      }
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Register successful",
      role: role,
    });
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  try {
    await createPasswordResetsTable();

    const [studentRows] = await db.promise().query(
      "SELECT email FROM students WHERE email = ?",
      [email]
    );

    const [ownerRows] = await db.promise().query(
      "SELECT email FROM boarding_owners WHERE email = ?",
      [email]
    );

    if (studentRows.length === 0 && ownerRows.length === 0) {
      return res.json({
        message:
          "If that email exists, password reset instructions have been sent.",
      });
    }

    const role = studentRows.length > 0 ? "student" : "owner";
    const token = crypto.randomBytes(32).toString("hex");

    await db.promise().query(
      "INSERT INTO password_resets (email, role, token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
      [email, role, token]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    console.log("Password reset requested for:", email);
    console.log("Reset link:", resetLink);

    return res.json({
      message:
        "If that email exists, password reset instructions have been sent.",
      resetLink,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Unable to process request" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > NOW()",
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const resetRecord = rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    const tableName = resetRecord.role === "student" ? "students" : "boarding_owners";
    const updateSql = `UPDATE ${tableName} SET password = ? WHERE email = ?`;

    const [updateResult] = await db.promise().query(updateSql, [
      hashedPassword,
      resetRecord.email,
    ]);

    if (updateResult.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "Unable to reset password for this user" });
    }

    await db.promise().query(
      "UPDATE password_resets SET used = 1 WHERE id = ?",
      [resetRecord.id]
    );

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};

// LOGIN CONTROLLER
export const login = (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  // First check students table
  const studentSql = "SELECT * FROM students WHERE email = ?";

  db.query(studentSql, [email], async (err, studentResult) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // Student found
    if (studentResult.length > 0) {
      const student = studentResult[0];

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const userId = student.studentID || student.id || student.student_id || student.userID;
      const token = jwt.sign({ id: userId, role: "student" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Build a safe user payload without password
      const userPayload = {
        id: userId,
        firstName: student.firstName || student.firstname || student.first_name || "",
        lastName: student.lastName || student.lastname || student.last_name || "",
        email: student.email,
        contactNo: student.contactNo || student.contact_no || "",
        role: "student",
      };

      return res.json({
        message: "Login successful",
        token,
        role: "student",
        user: userPayload,
      });
    }

    // If not student -> check boarding_owners table
    const ownerSql = "SELECT * FROM boarding_owners WHERE email = ?";

    db.query(ownerSql, [email], async (err, ownerResult) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // No user found
      if (ownerResult.length === 0) {
        return res.status(401).json({ message: "Invalid email" });
      }

      const owner = ownerResult[0];

      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const userId = owner.boardingOwnerID || owner.boardingownerid || owner.id || owner.ownerID;
      const token = jwt.sign({ id: userId, role: "owner" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const userPayload = {
        id: userId,
        firstName: owner.firstName || owner.firstname || owner.first_name || "",
        lastName: owner.lastName || owner.lastname || owner.last_name || "",
        email: owner.email,
        contactNo: owner.contactNo || owner.contact_no || "",
        role: "owner",
      };

      res.json({
        message: "Login successful",
        token,
        role: "owner",
        user: userPayload,
      });
    });
  });
};