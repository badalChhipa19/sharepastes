// External dependencies.
import express from "express";

// Internal dependencies.
import { createPaste, getPaste, getHealth } from "./controllers.js";
// Create an Express router.
const router = express.Router();

// Define a simple route.
router.route("/pastes/").post(createPaste);
router.route("/pastes/:id").get(getPaste);
router.route("/healthz").get(getHealth);

// Export the router.
export default router;
