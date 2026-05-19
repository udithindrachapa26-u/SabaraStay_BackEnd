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

  const freeWifi = req.body.freeWifi ? 1 : 0;
  const attachedBathroom = req.body.attachedBathroom ? 1 : 0;
  const parking = req.body.parking ? 1 : 0;
  const kitchen = req.body.kitchen ? 1 : 0;

  // Validate required fields
  if (!boardingName || !boardingType || !address || !price || !totalRooms || !availableSpace || !description || !distance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const boardingOwnerID = req.user.id;

  const sql = `
    INSERT INTO boarding_places
    (boardingOwnerID, boardingName, boardingType, address, price,
     totalRooms, availableSpace, description, distance, freeWifi, attachedBathroom, parking, kitchen)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      freeWifi,
      attachedBathroom,
      parking,
      kitchen,
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

export const getOwnerBoardings = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const sql = "SELECT * FROM boarding_places WHERE boardingOwnerID = ?";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    // Also fetch owner details to return along with boardings
    const ownerSql = "SELECT boardingOwnerID, firstName, lastName, email, contactNo FROM boarding_owners WHERE boardingOwnerID = ?";
    db.query(ownerSql, [req.user.id], (ownerErr, ownerRows) => {
      if (ownerErr) {
        console.error("Owner fetch error:", ownerErr);
        return res.status(500).json({ message: "Database error" });
      }

      const owner = ownerRows && ownerRows[0] ? {
        id: ownerRows[0].boardingOwnerID,
        firstName: ownerRows[0].firstName || ownerRows[0].firstname || "",
        lastName: ownerRows[0].lastName || ownerRows[0].lastname || "",
        email: ownerRows[0].email,
        contactNo: ownerRows[0].contactNo || ownerRows[0].contact_no || "",
        role: "owner",
      } : null;

      res.json({ owner, boardings: results });
    });
  });
};

export const updateBoarding = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const boardingID = parseInt(req.params.id, 10);
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

  const freeWifi = req.body.freeWifi ? 1 : 0;
  const attachedBathroom = req.body.attachedBathroom ? 1 : 0;
  const parking = req.body.parking ? 1 : 0;
  const kitchen = req.body.kitchen ? 1 : 0;

  if (!boardingName || !boardingType || !address || !price || !totalRooms || !availableSpace || !description || !distance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    UPDATE boarding_places
    SET boardingName = ?, boardingType = ?, address = ?, price = ?, totalRooms = ?, availableSpace = ?, description = ?, distance = ?, freeWifi = ?, attachedBathroom = ?, parking = ?, kitchen = ?
    WHERE boardingID = ? AND boardingOwnerID = ?
  `;

  db.query(
    sql,
    [
      boardingName,
      boardingType,
      address,
      parseFloat(price),
      parseInt(totalRooms, 10),
      parseInt(availableSpace, 10),
      description,
      parseFloat(distance),
      freeWifi,
      attachedBathroom,
      parking,
      kitchen,
      boardingID,
      req.user.id,
    ],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Boarding not found or access denied" });
      }

      res.json({ message: "Boarding updated successfully" });
    }
  );
};

export const deleteBoarding = (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const boardingID = parseInt(req.params.id, 10);

  const sql = "DELETE FROM boarding_places WHERE boardingID = ? AND boardingOwnerID = ?";
  db.query(sql, [boardingID, req.user.id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Boarding not found or access denied" });
    }

    res.json({ message: "Boarding deleted successfully" });
  });
};