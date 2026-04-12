import express from "express";
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

// REGISTER API
router.post("/register", register);

export default router;