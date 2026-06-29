import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Authentication Endpoints
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected Onboarding Endpoints
router.put("/complete-guide", authMiddleware, authController.completeGuide);

export default router;
