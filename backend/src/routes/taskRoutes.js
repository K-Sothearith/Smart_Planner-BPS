import express from "express";
import taskController from "../controllers/taskController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", taskController.getTaskById);

router.get("/:id", taskController.getTaskById);

router.post("/", taskController.createTask);

router.put("/", taskController.updateTask);

router.delete("/", taskController.deleteTask);

export default router;