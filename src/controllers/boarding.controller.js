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

  const freeWifi = req.body.freeWifi === "1" || req.body.freeWifi === true || req.body.freeWifi === 1 ? 1 : 0;
  const attachedBathroom = req.body.attachedBathroom === "1" || req.body.attachedBathroom === true || req.body.attachedBathroom === 1 ? 1 : 0;
  const parking = req.body.parking === "1" || req.body.parking === true || req.body.parking === 1 ? 1 : 0;
  const kitchen = req.body.kitchen === "1" || req.body.kitchen === true || req.body.kitchen === 1 ? 1 : 0;

  // Validate required fields
  if (!boardingName || !boardingType || !address || !price || !totalRooms || !availableSpace || !description || !distance) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one photo is required" });
  }

  if (req.files.length > 4) {
    return res.status(400).json({ message: "Maximum 4 photos allowed" });
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

export const getBoardings = (req, res) => {
  const {
    q,
    boardingType,
    minPrice,
    maxPrice,
    minRooms,
    maxRooms,
    maxDistance,
    freeWifi,
    attachedBathroom,
    parking,
    kitchen,
  } = req.query;

  // Track whether any real filter is being applied
  const hasFilters = !!(
    q || boardingType || minPrice || maxPrice || minRooms || maxRooms ||
    maxDistance ||
    freeWifi === "1" || freeWifi === "true" ||
    attachedBathroom === "1" || attachedBathroom === "true" ||
    parking === "1" || parking === "true" ||
    kitchen === "1" || kitchen === "true"
  );

  let sql = `
    SELECT b.*
    FROM boarding_places b
    WHERE 1=1
  `;
  const params = [];

  if (q) {
    const searchTerm = `%${q}%`;
    sql += " AND (b.boardingName LIKE ? OR b.address LIKE ? OR b.description LIKE ?)";
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (boardingType) {
    sql += " AND b.boardingType = ?";
    params.push(boardingType);
  }

  if (minPrice) {
    sql += " AND b.price >= ?";
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    sql += " AND b.price <= ?";
    params.push(parseFloat(maxPrice));
  }

  if (minRooms) {
    sql += " AND b.totalRooms >= ?";
    params.push(parseInt(minRooms, 10));
  }

  if (maxRooms) {
    sql += " AND b.totalRooms <= ?";
    params.push(parseInt(maxRooms, 10));
  }

  if (maxDistance) {
    sql += " AND b.distance <= ?";
    params.push(parseFloat(maxDistance));
  }

  if (freeWifi === "1" || freeWifi === "true") {
    sql += " AND b.freeWifi = 1";
  }

  if (attachedBathroom === "1" || attachedBathroom === "true") {
    sql += " AND b.attachedBathroom = 1";
  }

  if (parking === "1" || parking === "true") {
    sql += " AND b.parking = 1";
  }

  if (kitchen === "1" || kitchen === "true") {
    sql += " AND b.kitchen = 1";
  }

  if (hasFilters) {
    sql += " ORDER BY b.distance ASC, b.price ASC";
  } else {
    sql += " ORDER BY b.boardingID DESC";
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Database search error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const boardingIds = results.map((r) => r.boardingID);
    if (boardingIds.length === 0) {
      return res.json([]);
    }

    const photosSql = `
      SELECT boardingID, photoPath
      FROM boarding_photos
      WHERE boardingID IN (?)
      ORDER BY boardingID, photoID ASC
    `;

    db.query(photosSql, [boardingIds], (photoErr, photoResults) => {
      if (photoErr) {
        console.error("Photo fetch error:", photoErr);
        const normalized = results.map((row) => ({
          ...row,
          photos: [],
        }));
        return res.json(normalized);
      }

      const photosMap = {};
      photoResults.forEach((photo) => {
        if (!photosMap[photo.boardingID]) {
          photosMap[photo.boardingID] = [];
        }
        const normalizedPath = photo.photoPath.replace(/\\\\/g, "/");
        photosMap[photo.boardingID].push(normalizedPath);
      });

      const normalized = results.map((row) => ({
        ...row,
        photoPath: (photosMap[row.boardingID] && photosMap[row.boardingID][0]) || null,
        photos: photosMap[row.boardingID] || [],
      }));

      res.json(normalized);
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

  const freeWifi = req.body.freeWifi === "1" || req.body.freeWifi === true || req.body.freeWifi === 1 ? 1 : 0;
  const attachedBathroom = req.body.attachedBathroom === "1" || req.body.attachedBathroom === true || req.body.attachedBathroom === 1 ? 1 : 0;
  const parking = req.body.parking === "1" || req.body.parking === true || req.body.parking === 1 ? 1 : 0;
  const kitchen = req.body.kitchen === "1" || req.body.kitchen === true || req.body.kitchen === 1 ? 1 : 0;

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

// 🔍 GET SINGLE BOARDING BY ID
export const getBoardingById = (req, res) => {
  const boardingID = parseInt(req.params.id, 10);

  const sql = "SELECT * FROM boarding_places WHERE boardingID = ?";
  db.query(sql, [boardingID], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Boarding place not found" });
    }

    const boarding = results[0];

    // Fetch photos
    const photosSql = "SELECT photoPath FROM boarding_photos WHERE boardingID = ?";
    db.query(photosSql, [boardingID], (photoErr, photoResults) => {
      if (photoErr) {
        console.error("Photo fetch database error:", photoErr);
        return res.status(500).json({ message: "Database error" });
      }

      // Normalize photoPaths (replace backslashes with forward slashes for URL friendliness)
      boarding.photos = photoResults.map((p) => p.photoPath ? p.photoPath.replace(/\\/g, "/") : "");

      // Fetch owner info
      const ownerSql = "SELECT firstName, lastName, email, contactNo FROM boarding_owners WHERE boardingOwnerID = ?";
      db.query(ownerSql, [boarding.boardingOwnerID], (ownerErr, ownerResults) => {
        if (ownerErr) {
          console.error("Owner fetch database error:", ownerErr);
          return res.status(500).json({ message: "Database error" });
        }

        boarding.owner = ownerResults[0] || null;
        res.json(boarding);
      });
    });
  });
};

// 🕒 GET 4 RECENTLY ADDED BOARDINGS
export const getRecentBoardings = (req, res) => {
  const sql = `
    SELECT b.*
    FROM boarding_places b
    ORDER BY b.boardingID DESC
    LIMIT 4
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getRecentBoardings:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const boardingIds = results.map((r) => r.boardingID);
    if (boardingIds.length === 0) {
      return res.json([]);
    }

    const photosSql = `
      SELECT boardingID, photoPath
      FROM boarding_photos
      WHERE boardingID IN (?)
      ORDER BY boardingID, photoID ASC
    `;

    db.query(photosSql, [boardingIds], (photoErr, photoResults) => {
      if (photoErr) {
        console.error("Photo fetch error:", photoErr);
        const normalized = results.map((row) => ({
          ...row,
          photos: [],
        }));
        return res.json(normalized);
      }

      const photosMap = {};
      photoResults.forEach((photo) => {
        if (!photosMap[photo.boardingID]) {
          photosMap[photo.boardingID] = [];
        }
        const normalizedPath = photo.photoPath.replace(/\\\\/g, "/");
        photosMap[photo.boardingID].push(normalizedPath);
      });

      const normalizedResults = results.map((row) => ({
        ...row,
        photoPath: (photosMap[row.boardingID] && photosMap[row.boardingID][0]) || null,
        photos: photosMap[row.boardingID] || [],
      }));

      res.json(normalizedResults);
    });
  });
};