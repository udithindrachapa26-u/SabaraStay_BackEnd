import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function testInsert() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sabrastay",
  });

  console.log("Connected!");

  // Test 1: Check how many owners exist (to get a valid boardingOwnerID)
  const [owners] = await connection.query("SELECT boardingOwnerID FROM boarding_owners LIMIT 1");
  if (owners.length === 0) {
    console.error("No owners found in DB! Can't test insert.");
    await connection.end();
    return;
  }
  const boardingOwnerID = owners[0].boardingOwnerID;
  console.log("Using boardingOwnerID:", boardingOwnerID);

  // Test 2: Run the exact same INSERT as addBoarding
  const sql = `
    INSERT INTO boarding_places
    (boardingOwnerID, boardingName, boardingType, address, price,
     totalRooms, availableSpace, description, distance, freeWifi, attachedBathroom, parking, kitchen,
     shortTerm, longTerm, forLecturers)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    boardingOwnerID,
    "Test Boarding",
    "Male",
    "123 Test Street",
    5000.00,
    10,
    5,
    "Test description",
    1.5,
    1, 0, 1, 0,  // freeWifi, attachedBathroom, parking, kitchen
    1, 0, 0,     // shortTerm, longTerm, forLecturers
  ];

  console.log("Column count in SQL:", 16);
  console.log("Placeholder count:", (sql.match(/\?/g) || []).length);
  console.log("Param count:", params.length);

  try {
    const [result] = await connection.query(sql, params);
    console.log("INSERT SUCCESS! insertId:", result.insertId);

    // Clean up test row
    await connection.query("DELETE FROM boarding_places WHERE boardingID = ?", [result.insertId]);
    console.log("Cleaned up test row.");
  } catch (err) {
    console.error("INSERT FAILED:", err.message);
    console.error("SQL state:", err.sqlState);
    console.error("Error code:", err.code);
  }

  await connection.end();
}

testInsert();
