import { db } from "../config/db.js";

// ➕ ADD BOARDING
export const addBoarding = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const {
    boardingName,
    boardingType,
    address,
    price,
    totalRooms,
    availableSpace,
    description,
    distance,
  } = req.body;

  // Validate required fields
  if (!boardingName || !boardingType || !address || !price || !totalRooms || !availableSpace || !description || !distance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const boardingOwnerID = req.user.id;

  const sql = `
    INSERT INTO boarding_places
    (boardingOwnerID, boardingName, boardingType, address, price,
     totalRooms, availableSpace, description, distance)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      boardingOwnerID,
      boardingName,
      boardingType,
      address,
      parseFloat(price),
      parseInt(totalRooms),
      parseInt(availableSpace),
      description,
      parseFloat(distance),
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      const boardingID = result.insertId;

      // 📸 SAVE PHOTOS
      if (req.files && req.files.length > 0) {
        const values = req.files.map((file) => [
          boardingID,
          file.path,
        ]);

        db.query(
          "INSERT INTO boarding_photos (boardingID, photoPath) VALUES ?",
          [values],
          (photoErr) => {
            if (photoErr) {
              console.error("Photo insertion error:", photoErr);
              // Don't fail if photos fail - boarding was created
            }
          }
        );
      }

      res.status(201).json({ message: "Boarding added successfully", boardingID });
    }
  );
};