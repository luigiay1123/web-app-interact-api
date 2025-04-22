import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Route
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    const drink = response.data.drinks[0];
    console.log(drink);
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push({
          name: ingredient,
          measure: measure || "",
          thumbnail: `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`,
        });
      }
    }
    res.render("index", {
      name: drink.strDrink,
      instructions: drink.strInstructions,
      image: `${drink.strDrinkThumb}/small`,
      ingredients,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send("Couldn't fetch cocktail data. Please try again later.");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
