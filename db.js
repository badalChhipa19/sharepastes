// External dependencies.
import { createClient } from "redis";

// Internal dependencies.
import { REDIS_URL } from "./getENV.js";

// Create and configure a Redis client.
const redisClient = createClient({
  url: REDIS_URL,
});

// Export the Redis client.
export default redisClient;
