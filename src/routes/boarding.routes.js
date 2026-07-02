import express from "express";
import {
  addBoarding,
  getOwnerBoardings,
  getBoardings,
  getBoardingById,
  getRecentBoardings,
  updateBoarding,
  deleteBoarding,
} from "../controllers/boarding.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

const maybeUploadPhotos = (req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return upload.array("photos", 4)(req, res, next);
  }
  return next();
};

router.get("/", getBoardings);
router.post(
  "/",
  protect,
  maybeUploadPhotos,
  addBoarding
);
router.get("/owner", protect, getOwnerBoardings);
router.get("/recent", getRecentBoardings);
router.get("/:id", getBoardingById);
router.put("/:id", protect, updateBoarding);
router.delete("/:id", protect, deleteBoarding);

export default router;