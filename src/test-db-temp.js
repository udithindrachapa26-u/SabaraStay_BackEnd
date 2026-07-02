import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function checkTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sabrastay",
    });

    console.log("Connected to MySQL successfully!");
    const [rows] = await connection.query("DESCRIBE boarding_places");
    console.log("Columns of boarding_places:");
    console.table(rows.map(r => ({ Field: r.Field, Type: r.Type, Null: r.Null, Default: r.Default })));
    
    await connection.end();
  } catch (error) {
    console.error("Failed to connect or query MySQL:", error);
  }
}

checkTable();
