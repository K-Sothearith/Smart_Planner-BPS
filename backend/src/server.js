import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/study-sessions", studySessionRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", async (req, res, next) => {
  try {
    const [result] = await pool.query("SELECT 1 + 1 AS result");
    res.status(200).json({
      status: "OK",
      message: "Server is healthy and connected to database.",
      dbTest: result[0].result === 2 ? "Success" : "Failed",
    });
  } catch (error) {
    next(error);
  }
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Error-handling middleware (must be registered last)
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  
  try {
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to the MySQL Database cloud instance!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed at startup:");
    console.error(error.message);
  }
});

export default app;
