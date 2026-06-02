import { db } from "../config/db.js";

export const getMyBookings = (req, res) => {
  const studentId = req.user.id;

  const sql = `
    SELECT b.id, bd.boardingName AS boarding_name, bd.address AS boarding_address, b.status
    FROM bookings b
    JOIN boarding_places bd ON b.boarding_id = bd.boardingID
    WHERE b.user_id = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result);
  });
};