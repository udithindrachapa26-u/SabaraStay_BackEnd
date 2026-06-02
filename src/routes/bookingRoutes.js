import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { getMyBookings, getOwnerBookings, updateBookingStatus } from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/owner", protect, getOwnerBookings);
router.put("/:id", protect, updateBookingStatus);

export default router;