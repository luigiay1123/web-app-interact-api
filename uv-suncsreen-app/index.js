import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.port || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { forecastData: null, error: null });
});

app.post("/forecast", async (req, res) => {
  const userLocation = req.body.location;

  try {
    // Step 1: Geocode location to lat/lng
    const geoRes = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: userLocation,
          key: process.env.GEOCODE_API_KEY,
        },
      }
    );
    const { lat, lng } = geoRes.data.results[0].geometry;

    // Step 2: Get UV forecast for lat/lng
    const uvRes = await axios.get("https://api.openuv.io/api/v1/forecast", {
      headers: {
        "x-access-token": process.env.OPENUV_API_KEY,
      },
      params: { lat, lng },
    });

    const forecastData = uvRes.data.result.map((item) => {
      const hour = new Date(item.uv_time).getHours();
      let advice = "No sunscreen needed.";

      if (item.uv >= 3) {
        if (hour >= 10 && hour <= 16) {
          advice = "Yes, high UV risk—wear sunscreen!";
        } else {
          advice = "UV is moderate, consider sunscreen.";
        }
      }

      return {
        time: item.uv_time,
        uv: item.uv,
        advice,
      };
    });

    res.render("index", { forecastData, error: null });
  } catch (error) {
    console.error(error);
    res.render("index", {
      forecastData: null,
      error: "Could not fetch UV data. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
