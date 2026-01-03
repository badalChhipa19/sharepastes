// External dependencies.
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Internal dependencies.
import routes from "./routes.js";

// Create an Express application.
const app = express();

// Middleware to parse JSON bodies.
app.use(express.json());

// Allow frontend (5173) to call backend (3000)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  })
);

// Use the imported API routes first
app.use("/api", routes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Catch-all: serve index.html for frontend routes (React Router)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

// 404 handler (only if you want a custom page for non-matching frontend routes)
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.status(404).sendFile(path.join(__dirname, "frontend/dist", "404.html"));
});

// Export the app.
export default app;
