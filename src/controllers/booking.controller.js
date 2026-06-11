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

export const getOwnerBookings = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const sql = `
    SELECT
      b.id,
      b.start_date,
      b.months,
      b.status,
      b.created_at,
      u.studentID AS user_id,
      u.firstName AS firstName,
      u.lastName AS lastName,
      u.email AS email,
      bd.boardingID,
      bd.boardingName,
      bd.address AS boarding_address
    FROM bookings b
    JOIN boarding_places bd ON b.boarding_id = bd.boardingID
    JOIN students u ON b.user_id = u.studentID
    WHERE bd.boardingOwnerID = ?
    ORDER BY b.created_at DESC
  `;

  db.query(sql, [req.user.id], (err, result) => {
    if (err) {
      console.error("Failed to load owner bookings:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
};

export const updateBookingStatus = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const bookingId = parseInt(req.params.id, 10);
  const { status } = req.body;

  const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid booking status" });
  }

  const sql = `
    UPDATE bookings b
    JOIN boarding_places bd ON b.boarding_id = bd.boardingID
    SET b.status = ?
    WHERE b.id = ? AND bd.boardingOwnerID = ?
  `;

  db.query(sql, [status, bookingId, req.user.id], (err, result) => {
    if (err) {
      console.error("Failed to update booking status:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found or access denied" });
    }

    res.json({ message: "Booking status updated" });
  });
};