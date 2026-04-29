import { db } from "../config/db.js";

export const getMyProfile = (req, res) => {
  const studentId = req.user.id;

  const sql = "SELECT id, firstName, email FROM students WHERE id = ?";
  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result[0]);
  });
};