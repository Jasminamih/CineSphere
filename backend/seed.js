// backend/seed.js
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') }); // root .env

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Render
});

async function seed() {
  try {
    // 1️⃣ Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50),
        title VARCHAR(255),
        year INT,
        genre VARCHAR(100),
        description TEXT,
        image TEXT
      );
    `);

    console.log('✅ Table checked/created successfully.');

    // 2️⃣ Load JSON data
    const filePath = path.join(process.cwd(), 'data', 'movies.json'); // put movies.json in backend/
    const rawData = fs.readFileSync(filePath);
    const movies = JSON.parse(rawData);

    // 3️⃣ Insert data
    for (const movie of movies) {
      await pool.query(
        `INSERT INTO movies(id, type, title, year, genre, description, image)
         VALUES($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [movie.id, movie.type, movie.title, movie.year, movie.genre, movie.description, movie.image]
      );
    }

    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    await pool.end();
  }
}

seed();
