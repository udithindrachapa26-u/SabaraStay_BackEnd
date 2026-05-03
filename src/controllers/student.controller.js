import { db } from "../config/db.js";

export const getMyProfile = (req, res) => {
  const studentId = req.user.id;

  const sql = `
    SELECT
      studentID AS id,
      firstName,
      lastName,
      CONCAT(firstName, ' ', lastName) AS name,
      email,
      contactNo
    FROM students
    WHERE studentID = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(result[0]);
  });
};