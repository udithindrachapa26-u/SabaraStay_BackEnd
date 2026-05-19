import express from "express";
import {
  addBoarding,
  getOwnerBoardings,
  updateBoarding,
  deleteBoarding,
} from "../controllers/boarding.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("photos", 5),
  addBoarding
);
router.get("/owner", protect, getOwnerBoardings);
router.put("/:id", protect, updateBoarding);
router.delete("/:id", protect, deleteBoarding);

export default router;