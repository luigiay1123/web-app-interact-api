import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set view engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const symbol = req.query.symbol || "BTC-USD";
  const url = `https://api.blockchain.com/v3/exchange/tickers/${symbol}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "X-API-Token": process.env.API_KEY,
      },
    });

    const price = response.data.last_trade_price;

    res.render("index", { symbol, price });
  } catch (error) {
    console.error("Error fetching price:", error.message);
    res.render("index", { symbol, price: "Error retrieving price" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
