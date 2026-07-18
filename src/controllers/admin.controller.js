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

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // 1. Delete student's bookings
    await connection.query("DELETE FROM bookings WHERE user_id = ?", [studentId]);

    // 2. Delete student's appointments
    await connection.query("DELETE FROM appointments WHERE studentID = ?", [studentId]);

    // 3. Delete student's reviews
    await connection.query("DELETE FROM reviews WHERE studentID = ?", [studentId]);

    // 4. Delete student's notifications
    //await connection.query("DELETE FROM notifications WHERE studentID = ?", [studentId]);

    // 5. Delete student record
    const [result] = await connection.query("DELETE FROM students WHERE studentID = ?", [studentId]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Student not found" });
    }

    await connection.commit();
    res.json({ message: "Student and related data deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Database error" });
  } finally {
    connection.release();
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

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // Fetch all boardings belonging to this owner
    const [boardings] = await connection.query(
      "SELECT boardingID FROM boarding_places WHERE boardingOwnerID = ?",
      [ownerId]
    );

    const boardingIds = boardings.map((b) => b.boardingID);

    if (boardingIds.length > 0) {
      // Delete bookings for these boardings
      await connection.query("DELETE FROM bookings WHERE boardingID IN (?)", [boardingIds]);

      // Delete appointments for these boardings
      await connection.query("DELETE FROM appointments WHERE boardingID IN (?)", [boardingIds]);

      // Delete reviews for these boardings
      await connection.query("DELETE FROM reviews WHERE boardingID IN (?)", [boardingIds]);

      // Delete boarding photos
      await connection.query("DELETE FROM boarding_photos WHERE boardingID IN (?)", [boardingIds]);

      // Delete boardings
      await connection.query("DELETE FROM boarding_places WHERE boardingOwnerID = ?", [ownerId]);
    }

    // Finally delete owner
    const [result] = await connection.query("DELETE FROM boarding_owners WHERE boardingOwnerID = ?", [ownerId]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Boarding owner not found" });
    }

    await connection.commit();
    res.json({ message: "Boarding owner and related listings deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting owner:", error);
    res.status(500).json({ message: "Database error" });
  } finally {
    connection.release();
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

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // 1. Delete bookings for this boarding
    await connection.query("DELETE FROM bookings WHERE boardingID = ?", [boardingId]);

    // 2. Delete appointments for this boarding
    await connection.query("DELETE FROM appointments WHERE boardingID = ?", [boardingId]);

    // 3. Delete reviews for this boarding
    await connection.query("DELETE FROM reviews WHERE boardingID = ?", [boardingId]);

    // 4. Delete boarding photos
    await connection.query("DELETE FROM boarding_photos WHERE boardingID = ?", [boardingId]);

    // 5. Delete boarding listing
    const [result] = await connection.query("DELETE FROM boarding_places WHERE boardingID = ?", [boardingId]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Boarding listing not found" });
    }

    await connection.commit();
    res.json({ message: "Boarding listing moderated and deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting boarding listing:", error);
    res.status(500).json({ message: "Database error" });
  } finally {
    connection.release();
  }
};
