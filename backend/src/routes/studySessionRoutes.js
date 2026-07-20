import express from "express";
import studySessionController from "../controllers/studySessionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Study Sessions
 *   description: Study session management APIs
 */

/**
 * @swagger
 * /study-sessions:
 *   get:
 *     summary: Get all study sessions
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of study sessions returned successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", studySessionController.getSessions);

/**
 * @swagger
 * /study-sessions:
 *   post:
 *     summary: Create a new study session
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - start_time
 *               - end_time
 *             properties:
 *               taskId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Database Revision
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-19T09:00:00
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-07-19T11:00:00
 *               focus_technique:
 *                 type: string
 *                 example: Pomodoro
 *               break_duration:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Study session created successfully
 */
router.post("/", studySessionController.createSession);

/**
 * @swagger
 * /study-sessions/{id}:
 *   put:
 *     summary: Update a study session
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Study session ID
 *     responses:
 *       200:
 *         description: Study session updated successfully
 *       404:
 *         description: Study session not found
 */
router.put("/:id", studySessionController.updateSession);

/**
 * @swagger
 * /study-sessions/{id}:
 *   delete:
 *     summary: Delete a study session
 *     tags: [Study Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Study session ID
 *     responses:
 *       200:
 *         description: Study session deleted successfully
 *       404:
 *         description: Study session not found
 */
router.delete("/:id", studySessionController.deleteSession);

export default router;