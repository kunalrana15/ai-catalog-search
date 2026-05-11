import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import { requestLogger } from "./middlewares/requestLogger.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Health Route
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Root Route
app.get("/", (_req, res) => {
  res.json({
    message: "AI Catalog Search API",
  });
});

// Start Server
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start Express Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();