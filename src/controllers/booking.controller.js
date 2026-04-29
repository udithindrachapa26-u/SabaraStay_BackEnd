export const getMyBookings = (req, res) => {
  const studentId = req.user.id;

  const sql = `
    SELECT b.id, bd.name AS boarding_name, b.status
    FROM bookings b
    JOIN boardings bd ON b.boarding_id = bd.id
    WHERE b.student_id = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result);
  });
};