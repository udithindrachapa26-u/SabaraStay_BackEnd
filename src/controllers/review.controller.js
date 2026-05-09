import { db } from "../config/db.js";

// Add Review
export const addReview = (req, res) => {
  const boardingID = req.body.boardingID ?? req.body.boardingId ?? null;
  const rating = req.body.rating ?? null;
  const comment = req.body.comment?.trim() ?? null;
  const studentID = req.user?.id;

  if (!studentID) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const boardingIdNumber = boardingID ? Number(boardingID) : null;
  const ratingNumber = rating ? Number(rating) : null;

  if (!boardingIdNumber || Number.isNaN(ratingNumber)) {
    return res.status(400).json({ message: "Missing or invalid review data" });
  }

  if (ratingNumber < 1 || ratingNumber > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const sql = `
    INSERT INTO reviews (studentID, boardingID, rating, comment, reviewDate)
    VALUES (?, ?, ?, ?, CURDATE())
  `;

  db.query(
    sql,
    [studentID, boardingIdNumber, ratingNumber, comment],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(201).json({ message: "Review added successfully" });
    }
  );
};

// Get reviews for a boarding
export const getReviewsByBoarding = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT r.reviewID, r.rating, r.comment, r.reviewDate, s.firstName
    FROM reviews r
    JOIN students s ON r.studentID = s.studentID
    WHERE r.boardingID = ?
    ORDER BY r.reviewDate DESC
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
};