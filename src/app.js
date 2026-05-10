import express from "express";
import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import studentRoutes from "./routes/student.routes.js";

import reviewRoutes from "./routes/review.routes.js";

import boardingRoutes from "./routes/boarding.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boardings", boardingRoutes);

export default app;