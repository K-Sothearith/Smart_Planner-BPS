import express from "express";
import analyticsController from "../controllers/analyticsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and burnout monitoring APIs
 */

/**
 * @swagger
 * /analytics:
 *   get:
 *     summary: Get user analytics
 *     description: Returns productivity statistics, study session summaries, and task completion analytics.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", analyticsController.getAnalytics);

/**
 * @swagger
 * /analytics/burnout-log:
 *   post:
 *     summary: Submit a burnout log
 *     description: Records the user's mood, sleep, screen time, and burnout information.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moodLevel
 *               - sleepHours
 *               - sleepQuality
 *               - screenTime
 *             properties:
 *               moodLevel:
 *                 type: string
 *                 example: Happy
 *               sleepHours:
 *                 type: string
 *                 example: 7-8 hours
 *               sleepQuality:
 *                 type: integer
 *                 example: 4
 *               screenTime:
 *                 type: string
 *                 example: 5-6 hours
 *               note:
 *                 type: string
 *                 example: Feeling motivated today.
 *     responses:
 *       201:
 *         description: Burnout log created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post("/burnout-log", analyticsController.logBurnout);

export default router;