const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const router = express.Router();
const JWT_SECRET = "your_super_secret"; // use env var in real apps

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email",
      [name, email, hashed]
    );
    const token = jwt.sign({ user: result.rows[0].id }, JWT_SECRET);
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userRes = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (!userRes.rows.length)
    return res.status(400).json({ error: "Invalid credentials" });

  const user = userRes.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ user: user.id }, JWT_SECRET);
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

module.exports = router;
