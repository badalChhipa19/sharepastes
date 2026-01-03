import { nanoid } from "nanoid";
import redisClient from "./db.js";

// Crete Paste controller.
export const createPaste = async (req, res) => {
  try {
    if (
      !req.body ||
      typeof req.body.content !== "string" ||
      !req.body.content.trim()
    ) {
      return res
        .status(400)
        .json({ error: "Content is required and must be a non-empty string" });
    }

    const { content, ttl_seconds, max_views } = req.body;

    // Validate optional fields
    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return res
        .status(400)
        .json({ error: "ttl_seconds must be an integer ≥ 1" });
    }
    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return res
        .status(400)
        .json({ error: "max_views must be an integer ≥ 1" });
    }

    // Generate unique ID
    const id = nanoid(10);
    const key = `paste:${id}`;

    // Store in Redis
    const pasteData = {
      content,
      ttl_seconds: ttl_seconds ?? null,
      max_views: max_views ?? null,
      views_used: 0,
      created_at: Date.now(),
    };

    await redisClient.set(key, JSON.stringify(pasteData));

    // Set TTL if provided
    if (ttl_seconds) {
      await redisClient.expire(key, ttl_seconds);
    }

    // Respond with spec-compliant payload
    res.status(201).json({
      id,
      url: `${req.protocol}://${req.get("host")}/p/${id}`,
    });
  } catch (err) {
    console.error("Error creating paste:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get paste from DB.
export const getPaste = async (req, res) => {
  try {
    const { id } = req.params;

    const associatedData = await redisClient.get(`paste:${id}`);
    if (!associatedData) {
      return res
        .status(404)
        .json({ status: "fail", message: "Invalid ID or data has expired." });
    }

    const paste = JSON.parse(associatedData);

    // Check view limit
    if (paste.max_views && paste.views_used >= paste.max_views) {
      return res
        .status(404)
        .json({ status: "fail", message: "Max view limit reached." });
    }

    // Increment views
    paste.views_used += 1;

    // Update DB but preserve TTL
    await redisClient.set(`paste:${id}`, JSON.stringify(paste), {
      KEEPTTL: true,
    });

    // Respond with correct format
    res.status(200).json({
      content: paste.content,
      remaining_views: paste.max_views
        ? paste.max_views - paste.views_used
        : null,
      expires_at: paste.ttl_seconds
        ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString()
        : null,
    });
  } catch (err) {
    console.error("Error fetching paste:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Healthz report.
export const getHealth = async (req, res) => {
  try {
    // Ping Redis to check connectivity
    await redisClient.ping();

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err);
    res
      .status(500)
      .json({ ok: false, error: "Persistence layer not reachable" });
  }
};
