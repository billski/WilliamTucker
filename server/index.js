require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Middleware to validate and sanitize URLs
app.use((req, res, next) => {
  try {
    // Decode the URL to catch invalid percent-encoded characters
    decodeURIComponent(req.path);
    next();
  } catch (err) {
    // Log the suspicious request
    console.warn(`Suspicious request detected: ${req.path} from ${req.ip}`);
    // Return a 400 Bad Request response
    res.status(400).json({ error: "Invalid URL" });
  }
});

// Middleware to prevent directory traversal
app.use((req, res, next) => {
  const normalizedPath = path.normalize(req.path);
  if (normalizedPath.includes("..") || normalizedPath.includes("\\")) {
    console.warn(
      `Directory traversal attempt detected: ${req.path} from ${req.ip}`
    );
    return res.status(403).json({ error: "Access denied" });
  }
  next();
});

// Rate limiting for all requests
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use(globalLimiter);

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    console.log(`No token provided for ${req.path}`);
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    console.log(`Invalid token for ${req.path}: ${err.message}`);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log("Health check requested");
  res.status(200).json({ status: "ok" });
});

// API Routes (Before static middleware)
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
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// Serve static files from the root directory (excluding /public/ and /assets/)
app.use(
  (req, res, next) => {
    // Skip serving /public/ and /assets/ through this middleware
    if (req.path.startsWith("/public") || req.path.startsWith("/assets")) {
      console.log(`Skipping root middleware for request: ${req.path}`);
      return next();
    }
    express.static(path.join(__dirname, ".."), { maxAge: 0 })(req, res, next);
  },
  (req, res, next) => {
    if (!req.path.startsWith("/public") && !req.path.startsWith("/assets")) {
      console.log(`Serving static file from root: ${req.path}`);
    }
    next();
  }
);

// Serve /assets/ publicly (from the root /assets/ directory)
app.use(
  "/assets",
  express.static(path.join(__dirname, "../assets"), { maxAge: 0 }),
  (req, res, next) => {
    console.log(`Serving asset file: ${req.path}`);
    next();
  }
);

// Serve /public/ files only for authenticated users (from the root /public/ directory)
app.use(
  "/public",
  (req, res, next) => {
    // Add X-Robots-Tag header to prevent indexing
    res.set("X-Robots-Tag", "noindex, nofollow");
    next();
  },
  authenticateToken,
  express.static(path.join(__dirname, "../public"), { maxAge: 0 }),
  (req, res, next) => {
    console.log(`Serving public file: ${req.path} for authenticated user`);
    next();
  }
);

// Database connection
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

// Catch-all route for React Router (serve index.html from the root directory)
app.get("*", (req, res) => {
  console.log(`Catch-all route hit: ${req.path}`);
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Unhandled error for request ${req.path}:`, err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
