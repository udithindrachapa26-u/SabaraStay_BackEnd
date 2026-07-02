import mysql from "mysql2";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const ensureBoardingSchema = async () => {
  const columnStatements = [
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS freeWifi TINYINT(1) DEFAULT 0",
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS attachedBathroom TINYINT(1) DEFAULT 0",
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS parking TINYINT(1) DEFAULT 0",
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS kitchen TINYINT(1) DEFAULT 0",
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS shortTerm TINYINT(1) DEFAULT 0",
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS longTerm TINYINT(1) DEFAULT 0",
    "ALTER TABLE boarding_places ADD COLUMN IF NOT EXISTS forLecturers TINYINT(1) DEFAULT 0",
  ];

  const photosTableSql = `
    CREATE TABLE IF NOT EXISTS boarding_photos (
      photoID INT AUTO_INCREMENT PRIMARY KEY,
      boardingID INT NOT NULL,
      photoPath VARCHAR(500) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_boarding_photos FOREIGN KEY (boardingID)
        REFERENCES boarding_places(boardingID)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `;

  try {
    for (const sql of columnStatements) {
      await db.promise().query(sql);
    }
    await db.promise().query(photosTableSql);
    console.log("✅ Boarding schema is ready");
  } catch (error) {
    console.error("⚠️ Boarding schema check failed:", error.message);
  }
};

db.getConnection((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully");
    ensureBoardingSchema();
  }
});


