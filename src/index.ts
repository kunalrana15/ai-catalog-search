import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.get("/health", (_, res) => res.json({ ok: true }));

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(process.env.PORT ?? 4000, () =>
    console.log(`🚀 Server running on port ${process.env.PORT ?? 4000}`)
  );
});