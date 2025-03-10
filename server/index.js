require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
  console.log("Connected to MySQL");
  const hashedPassword = bcrypt.hashSync("adminpass", 10);
  console.log("Hashed password for admin:", hashedPassword);
  db.query(
    "INSERT IGNORE INTO users (username, password, name, isAdmin) VALUES (?, ?, ?, ?)",
    ["admin", hashedPassword, "Admin", 1],
    (err, result) => {
      if (err) {
        console.error("Error initializing admin user:", err.message);
        throw err;
      }
      console.log("Admin user initialization result:", result);
      console.log("Admin user initialized");
    }
  );
});

// Login and generate JWT
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: "User not found" });
        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ error: "Invalid password" });
        }
        const token = jwt.sign(
          { id: user.id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({
          success: true,
          token,
          user: { id: user.id, name: user.name, isAdmin: user.isAdmin },
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded; // Add decoded user data to request
    next();
  });
};

// Protected route: Get all users (for admin)
app.get("/api/users", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  db.query("SELECT id, username, name, isAdmin FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});