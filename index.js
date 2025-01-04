const express = require("express");
const { createCanvas } = require("canvas");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Load Ayat from JSON file
const ayat = JSON.parse(fs.readFileSync("./ayat.json", "utf-8"));

// Helper Function: Get a Random Ayah
function getRandomAyah() {
  return ayat[Math.floor(Math.random() * ayat.length)];
}

// Route 1: Return Random Ayah as JSON
app.get("/api/ayat/json", (req, res) => {
  const randomAyah = getRandomAyah();
  res.json(randomAyah);
});

// Route 2: Generate and Return Ayah as Image
app.get("/api/ayat/image", (req, res) => {
  const { theme = "dark", type = "vertical", lang = "arabic" } = req.query;
  const randomAyah = getRandomAyah();

  const canvas = createCanvas(800, type === "vertical" ? 300 : 200);
  const ctx = canvas.getContext("2d");

  // Background Color
  ctx.fillStyle = theme === "dark" ? "#1a1a1d" : "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text Styling
  const text = randomAyah.text[lang.toLowerCase()] || randomAyah.text["arabic"];
  ctx.font = "20px Arial";
  ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
  ctx.fillText(text, 50, 100);

  ctx.font = "16px Arial";
  ctx.fillText(
    `- Surah: ${randomAyah.surah}, Ayah: ${randomAyah.ayah}`,
    50,
    150
  );

  // Return as PNG Image
  res.setHeader("Content-Type", "image/png");
  res.send(canvas.toBuffer());
});

// Home Route
app.get("/", (req, res) => {
  res.send(
    "Quran Ayat Widget is running! Use /api/ayat/json or /api/ayat/image."
  );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
