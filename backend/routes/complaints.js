const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// GET user's complaints
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT id, message, created_at FROM complaints WHERE user_id=$1 ORDER BY created_at DESC",
    [req.userId]
  );
  res.json(result.rows);
});

// POST a new complaint
router.post("/", async (req, res) => {
  const { message } = req.body;
  const result = await pool.query(
    "INSERT INTO complaints (user_id, message) VALUES ($1, $2) RETURNING id, message, created_at",
    [req.userId, message]
  );
  res.status(201).json(result.rows[0]);
});

module.exports = router;
