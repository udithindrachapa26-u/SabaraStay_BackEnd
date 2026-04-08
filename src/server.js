//import dotenv from "dotenv";
//dotenv.config();

import { config } from '@dotenvx/dotenvx';
//import path from "path";
//import { fileURLToPath } from "url";

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//console.log("CWD:", process.cwd());
config(); // dotenv.config(); // { path: path.resolve(__dirname, "../.env") }

//console.log("DB_HOST:", process.env.DB_HOST);

import app from "./app.js";
import "./config/db.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});