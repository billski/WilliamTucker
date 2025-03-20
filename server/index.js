require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, "../dist")));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
  const hashedPassword = bcrypt.hashSync("Ranger&$&", 10);
  db.query(
    "INSERT IGNORE INTO users (username, password, name, isAdmin) VALUES (?, ?, ?, ?)",
    ["wtucker", hashedPassword, "Admin", 1],
    (err) => {
      if (err) throw err;
      console.log("Admin user initialized");
    }
  );
});

// Login API route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0)
          return res.status(401).json({ error: "User not found" });
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

// Catch-all route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
