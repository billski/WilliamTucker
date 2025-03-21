require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files with logging
app.use(
  express.static(path.join(__dirname, "../"), { maxAge: "1d" }),
  (req, res, next) => {
    console.log(`Serving static file: ${req.path}`);
    next();
  }
);

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many login attempts, please try again later.",
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 FROM users LIMIT 1");
    const hashedPassword = bcrypt.hashSync("Ranger&$&", 10);
    await db.query(
      "INSERT IGNORE INTO users (username, password, name, isAdmin) VALUES (?, ?, ?, ?)",
      ["wtucker", hashedPassword, "Admin", 1]
    );
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
})();

app.post("/api/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    const [results] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Catch-all route for React Router
app.get("*", (req, res) => {
  console.log(`Catch-all route hit: ${req.path}`);
  res.sendFile(path.join(__dirname, "../", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
