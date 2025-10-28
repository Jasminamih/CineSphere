// backend/server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;
const JWT_SECRET = "supersecretkey"; // in production, use env vars

app.use(cors());
app.use(express.json());

// --------------------
// Helper functions
// --------------------
const readJSON = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, "utf-8"));
  } catch {
    return [];
  }
};

const writeJSON = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

// --------------------
// Users (for auth)
// --------------------
const usersPath = "./data/users.json";
let users = readJSON(usersPath);

// --------------------
// Middleware
// --------------------
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists
    const userExists = users.find(u => u.id === decoded.userId);
    if (!userExists) return res.status(401).json({ message: "User not found" });

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// --------------------
// Login route
// --------------------
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // send both token and username
  res.json({ token, username: user.username });
});
// --------------------
// Register route
// --------------------
app.post("/auth/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email)
    return res
      .status(400)
      .json({ message: "Username, email, and password required" });

  const existingUser = users.find((u) => u.username === username);
  if (existingUser)
    return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    email, // store email
    password: hashedPassword,
  };

  users.push(newUser);
  writeJSON(usersPath, users);

  res.status(201).json({ message: "Registration successful" });
});

// --------------------
// Movies
// --------------------
const dataPath = "./data/movies.json";
let items = readJSON(dataPath);

// GET /items
app.get("/items", (req, res) => {
  let results = [...items];
  const { genre, type, search, sort } = req.query;

  if (genre)
    results = results.filter((i) =>
      i.genre.toLowerCase().includes(genre.toLowerCase())
    );
  if (type)
    results = results.filter(
      (i) => i.type.toLowerCase() === type.toLowerCase()
    );
  if (search)
    results = results.filter((i) =>
      i.title.toLowerCase().includes(search.toLowerCase())
    );

  if (sort) {
    if (sort === "year") results.sort((a, b) => a.year - b.year);
    else if (sort === "title" || sort === "type") {
      results.sort((a, b) =>
        a[sort].toString().localeCompare(b[sort].toString())
      );
    }
  }

  res.json(results);
});

// GET /items/:id
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((i) => i.id === id);
  item ? res.json(item) : res.status(404).json({ message: "Not found" });
});

// POST /items
app.post("/items", (req, res) => {
  const { title, type, year, genre, description, image } = req.body;
  if (!title || !type)
    return res.status(400).json({ message: "Title and type are required" });

  const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
  const newItem = {
    id: newId,
    title,
    type,
    year: year || "",
    genre: genre || "",
    description: description || "",
    image: image || "",
  };

  items.push(newItem);
  writeJSON(dataPath, items);
  res.status(201).json(newItem);
});

// --------------------
// Favourites per user
// --------------------
const favouritesPath = "./data/favourites.json";
let favourites = readJSON(favouritesPath);

// GET favourites (for logged-in user)
app.get("/favourites", authenticate, (req, res) => {
  const userId = req.user.userId;
  const favs = favourites[userId] || [];
  res.json(favs);
});

// POST add favourite
app.post("/favourites", authenticate, (req, res) => {
  const userId = req.user.userId;
  const item = req.body;

  if (!favourites[userId]) favourites[userId] = [];
  const exists = favourites[userId].find((f) => f.id === item.id);
  if (exists)
    return res.status(400).json({ message: "Item already in favourites" });

  favourites[userId].push(item);
  writeJSON(favouritesPath, favourites);
  res
    .status(201)
    .json({ message: "Added to favourites", favourites: favourites[userId] });
});

// DELETE remove favourite
app.delete("/favourites/:id", authenticate, (req, res) => {
  const userId = req.user.userId;
  const id = parseInt(req.params.id);
  const userFavs = favourites[userId] || [];
  const index = userFavs.findIndex((f) => f.id === id);

  if (index === -1) return res.status(404).json({ message: "Item not found" });

  userFavs.splice(index, 1);
  favourites[userId] = userFavs;
  writeJSON(favouritesPath, favourites);
  res.json({ message: "Removed from favourites", favourites: userFavs });
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
