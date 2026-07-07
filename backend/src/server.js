import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Middlewares
app.use(cors());
app.use(express.json());

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/study-sessions", studySessionRoutes);
app.use("/api/analytics", analyticsRoutes);

// Simple Health-Check Route
app.get("/api/health", async (req, res, next) => {
  try {
    // Run a simple test query to ensure MySQL is reachable
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

// Register the error-handling middleware (MUST be the last middleware registered)
app.use(errorHandler);

// Start Express Server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  
  // Test DB connection immediately on startup
  try {
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to the MySQL Database cloud instance!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed at startup:");
    console.error(error.message);
  }
});
