import express from "express";
import studySessionController from "../controllers/studySessionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", studySessionController.getSessions);
router.post("/", studySessionController.createSession);
router.delete("/:id", studySessionController.deleteSession);

export default router;
