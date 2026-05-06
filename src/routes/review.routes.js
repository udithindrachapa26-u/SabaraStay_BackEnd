import express from "express";
import { addReview, getReviewsByBoarding } from "../controllers/review.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/boarding/:id", getReviewsByBoarding);

export default router;