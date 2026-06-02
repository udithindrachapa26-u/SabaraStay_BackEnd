import { db } from "../config/db.js";

export const getMyAppointments = (req, res) => {
  const studentId = req.user.id;

  const sql = `
    SELECT 
      a.appointmentID, 
      a.appointmentDate, 
      a.appointmentTime, 
      a.status, 
      bd.boardingName
    FROM appointments a
    JOIN boarding_places bd ON a.boardingID = bd.boardingID
    WHERE a.studentID = ?
  `;

  db.query(sql, [studentId], (err, result) => {
    if (err) {
      console.error("DB error fetching appointments:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
};
