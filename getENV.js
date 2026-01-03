// External dependencies.
import dotenv from "dotenv";

// Load environment variables from .env file.
dotenv.config();

// Export the environment variables.
export const PORT = process.env.PORT;
export const REDIS_URL = process.env.REDIS_URL;
