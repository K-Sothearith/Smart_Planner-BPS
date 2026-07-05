import express from "express";
import analyticsController from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all analytics endpoints
router.use(authMiddleware);

// GET /api/analytics
router.get("/", analyticsController.getAnalytics);

// POST /api/analytics/burnout-log
router.post("/burnout-log", analyticsController.logBurnout);

export default router;
