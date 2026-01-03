// External dependencies.
import express from "express";

// Internal dependencies.
import app from "./app.js";
import { PORT } from "./getENV.js";
import redisClient from "./db.js";

// Connect to Redis.
await redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

// Start the server.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
