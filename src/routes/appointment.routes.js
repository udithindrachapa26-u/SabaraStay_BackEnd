import express from "express";
import { getMyAppointments } from "../controllers/appointment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/my", protect, getMyAppointments);

export default router;
