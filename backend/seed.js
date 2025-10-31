// backend/seed.js
import pg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";


dotenv.config(); 


const { Pool } = pg;
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
   
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(255),
        year INT,
        genre VARCHAR(100),
        description TEXT,
        image TEXT,
        order_index INT DEFAULT 9999
      );
    `);
    console.log("✅ Table checked/created successfully.");

    const filePath = path.join(process.cwd(), "data", "movies.json");
    const rawData = fs.readFileSync(filePath, "utf-8");
    const movies = JSON.parse(rawData);

    for (const movie of movies) {
      const orderIndex = movie.title === "Stranger Things" ? 0 : 9999;
      await pool.query(
        `
        INSERT INTO movies(id, type, title, year, genre, description, image, order_index)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `,
        [
          movie.id,
          movie.type,
          movie.title,
          movie.year,
          movie.genre,
          movie.description,
          movie.image,
          orderIndex,
        ]
      );
    }

    console.log("✅ Database seeded successfully!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

seed();
