// index.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Load city list once at startup
const cityList = JSON.parse(
  fs.readFileSync(path.join("data", "city.list.json"))
);

app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post("/weather", async (req, res) => {
  const inputCity = req.body.city.trim().toLowerCase();
  const apiKey = process.env.API_KEY;

  // Find city in city list (case insensitive)
  const matchedCity = cityList.find(
    (city) => city.name.toLowerCase() === inputCity
  );

  if (!matchedCity) {
    return res.render("index", {
      weather: null,
      error: "City not found in city list.",
    });
  }

  const cityId = matchedCity.id;

  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&appid=${apiKey}`;
    const response = await axios.get(weatherUrl);

    res.render("index", { weather: response.data, error: null });
  } catch (error) {
    res.render("index", {
      weather: null,
      error: "Could not retrieve weather data.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
