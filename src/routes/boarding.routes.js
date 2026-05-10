import express from "express";
import { addBoarding } from "../controllers/boarding.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("photos", 5),
  addBoarding
);

export default router;