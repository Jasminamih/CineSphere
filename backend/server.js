import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ----------------------
// Auth middleware
// ----------------------
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);
    if (rows.length === 0)
      return res.status(401).json({ message: "User not found" });

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ----------------------
// Auth routes
// ----------------------
app.post("/auth/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email)
    return res
      .status(400)
      .json({ message: "Username, email, and password required" });

  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (rows.length > 0)
    return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
    [username, email, hashedPassword]
  );

  res.status(201).json({ message: "Registration successful" });
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ token, username: user.username });
});

// ----------------------
// Movies routes
// ----------------------
app.get("/items", async (req, res) => {
  const { genre, type, search, sort } = req.query;
  try {
    let query = "SELECT * FROM movies";
    const conditions = [];
    const values = [];

    if (genre) {
      values.push(`%${genre}%`);
      conditions.push(`genre ILIKE $${values.length}`);
    }
    if (type) {
      values.push(type);
      conditions.push(`type ILIKE $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }
    if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");

    // ✅ Always order by order_index first, then optional sort, then id
    const allowed = ["title", "type", "year"];
    if (sort && allowed.includes(sort)) {
      query += ` ORDER BY order_index ASC, ${sort} ASC, id ASC`;
    } else {
      query += ` ORDER BY order_index ASC, id ASC`;
    }

    const { limit, offset } = req.query;
    if (limit) query += ` LIMIT ${parseInt(limit)}`;
    if (offset) query += ` OFFSET ${parseInt(offset)}`;

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/items/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rows } = await pool.query("SELECT * FROM movies WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------
// Favourites routes
// ----------------------
app.get("/favourites", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT m.* FROM favourites f JOIN movies m ON f.movie_id = m.id WHERE f.user_id = $1",
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/favourites", authenticate, async (req, res) => {
  const { id: movie_id } = req.body;
  const user_id = req.user.userId;

  try {
    await pool.query(
      "INSERT INTO favourites(user_id, movie_id) VALUES($1, $2) ON CONFLICT DO NOTHING",
      [user_id, movie_id]
    );
    res.status(201).json({ message: "Added to favourites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/favourites/:id", authenticate, async (req, res) => {
  const movie_id = parseInt(req.params.id);
  const user_id = req.user.userId;

  try {
    await pool.query(
      "DELETE FROM favourites WHERE user_id = $1 AND movie_id = $2",
      [user_id, movie_id]
    );
    res.json({ message: "Removed from favourites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
