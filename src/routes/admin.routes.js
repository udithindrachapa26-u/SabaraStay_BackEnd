import express from "express";
import {
  getAllStudents,
  deleteStudent,
  getAllOwners,
  deleteOwner,
  getAllBoardings,
  deleteBoarding,
} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// Apply role guards globally for all admin sub-routes
router.use(protect, isAdmin);

// Student management routes
router.get("/students", getAllStudents);
router.delete("/students/:id", deleteStudent);

// Owner management routes
router.get("/owners", getAllOwners);
router.delete("/owners/:id", deleteOwner);

// Boarding moderation routes
router.get("/boardings", getAllBoardings);
router.delete("/boardings/:id", deleteBoarding);

export default router;
