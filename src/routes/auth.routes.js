import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../controllers/auth.controller.js";

const router = express.Router();

// REGISTER API
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google-login", googleLogin);

export default router;