import express from "express";
import cors from "cors";
import fs from "fs";
import { writeFileSync } from "fs"; // at the top with imports

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load data from JSON file
const dataPath = "./data/movies.json";
let items = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Routes
app.get("/", (req, res) => {
  res.send("Movies & Series API running...");
});

app.get("/items", (req, res) => {
  res.json(items);
});

app.get("/items/type/:type", (req, res) => {
  const type = req.params.type;
  const filtered = items.filter(i => i.type.toLowerCase() === type.toLowerCase());
  res.json(filtered);
});

app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  item ? res.json(item) : res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


// POST /items - add a new movie/series
app.post("/items", (req, res) => {
  const { title, type, year, genre, description, image } = req.body;

  if (!title || !type) {
    return res.status(400).json({ message: "Title and type are required" });
  }

  // Generate a new ID
  const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;

  const newItem = {
    id: newId,
    title,
    type,
    year: year || "",
    genre: genre || "",
    description: description || "",
    image: image || ""
  };

  // Add to array
  items.push(newItem);

  // Write updated array to JSON file
  writeFileSync("./data/movies.json", JSON.stringify(items, null, 2));

  res.status(201).json(newItem);
});