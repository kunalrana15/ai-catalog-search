import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import connectDB from "./config/db.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);
app.use('/api/v1',routes);
app.use(errorHandler);


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