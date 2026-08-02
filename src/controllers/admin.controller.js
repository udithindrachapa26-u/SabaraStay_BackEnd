 import { db } from "../config/db.js";

// GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT studentID AS id, firstName, lastName, email, contactNo FROM students ORDER BY studentID DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Database error" });
  }
};

// DELETE STUDENT (AND REFERENCES)
export const deleteStudent = async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  if (isNaN(studentId)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  try {
    // Delete dependent records first, then the student
    // Note: bookings table uses 'user_id' column for student reference
    await db.promise().query("DELETE FROM bookings WHERE user_id = ?", [studentId]);
    await db.promise().query("DELETE FROM appointments WHERE studentID = ?", [studentId]);
    await db.promise().query("DELETE FROM reviews WHERE studentID = ?", [studentId]);

    const [result] = await db.promise().query("DELETE FROM students WHERE studentID = ?", [studentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Database error: " + error.message });
  }
};

// GET ALL OWNERS
export const getAllOwners = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT boardingOwnerID AS id, firstName, lastName, email, contactNo FROM boarding_owners ORDER BY boardingOwnerID DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ message: "Database error" });
  }
};

// DELETE OWNER (AND REFERENCES)
export const deleteOwner = async (req, res) => {
  const ownerId = parseInt(req.params.id, 10);
  if (isNaN(ownerId)) {
    return res.status(400).json({ message: "Invalid owner ID" });
  }

  try {
    // Fetch all boarding IDs owned by this owner
    const [boardings] = await db.promise().query(
      "SELECT boardingID FROM boarding_places WHERE boardingOwnerID = ?",
      [ownerId]
    );
    const boardingIds = boardings.map((b) => b.boardingID);

    if (boardingIds.length > 0) {
      // Note: bookings table uses 'boarding_id' column, not 'boardingID'
      await db.promise().query("DELETE FROM bookings WHERE boarding_id IN (?)", [boardingIds]);
      await db.promise().query("DELETE FROM appointments WHERE boardingID IN (?)", [boardingIds]);
      await db.promise().query("DELETE FROM reviews WHERE boardingID IN (?)", [boardingIds]);
      await db.promise().query("DELETE FROM boarding_photos WHERE boardingID IN (?)", [boardingIds]);
      await db.promise().query("DELETE FROM boarding_places WHERE boardingOwnerID = ?", [ownerId]);
    }

    const [result] = await db.promise().query(
      "DELETE FROM boarding_owners WHERE boardingOwnerID = ?",
      [ownerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Boarding owner not found" });
    }

    res.json({ message: "Boarding owner and related listings deleted successfully" });
  } catch (error) {
    console.error("Error deleting owner:", error);
    res.status(500).json({ message: "Database error: " + error.message });
  }
};

// GET ALL BOARDINGS
export const getAllBoardings = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT b.*, o.firstName AS ownerFirstName, o.lastName AS ownerLastName 
       FROM boarding_places b
       LEFT JOIN boarding_owners o ON b.boardingOwnerID = o.boardingOwnerID
       ORDER BY b.boardingID DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching boardings:", error);
    res.status(500).json({ message: "Database error" });
  }
};

// DELETE BOARDING LISTING (MODERATION ACTION)
export const deleteBoarding = async (req, res) => {
  const boardingId = parseInt(req.params.id, 10);
  if (isNaN(boardingId)) {
    return res.status(400).json({ message: "Invalid boarding ID" });
  }

  try {
    // Note: bookings table uses 'boarding_id' column, not 'boardingID'
    await db.promise().query("DELETE FROM bookings WHERE boarding_id = ?", [boardingId]);
    await db.promise().query("DELETE FROM appointments WHERE boardingID = ?", [boardingId]);
    await db.promise().query("DELETE FROM reviews WHERE boardingID = ?", [boardingId]);
    await db.promise().query("DELETE FROM boarding_photos WHERE boardingID = ?", [boardingId]);

    const [result] = await db.promise().query(
      "DELETE FROM boarding_places WHERE boardingID = ?",
      [boardingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Boarding listing not found" });
    }

    res.json({ message: "Boarding listing moderated and deleted successfully" });
  } catch (error) {
    console.error("Error deleting boarding listing:", error);
    res.status(500).json({ message: "Database error: " + error.message });
  }
};
