import { db } from "../config/db.js"; // your mysql connection

export const createBooking = (req, res) => {
  const userId = req.user?.id;
  const { boardingId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const sql = `
    INSERT INTO bookings (user_id, boarding_id, status)
    VALUES (?, ?, 'PENDING')
  `;

  db.query(sql, [userId, boardingId], (err) => {
    if (err) {
      return res.status(500).json({ message: "Booking failed" });
    }
    res.status(201).json({ message: "Booking successful" });
  });
};