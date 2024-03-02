const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");

const mealsRouter = require("./api/meals");
const reservationsRouter = require("./api/reservations");
const buildPath = path.join(__dirname, "../../dist");
const port = process.env.PORT || 3000;
const cors = require("cors");
const knex = require("./database");

// For week4 no need to look into this!
// Serve the built client html
app.use(express.static(buildPath));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(cors());

router.use("/reservations", reservationsRouter);
router.use("/meals", mealsRouter);

//Respond with all meals in the future (relative to the when datetime) - /future-meals

app.get("/future-meals", async (req, res) => {
  try {
    const today = new Date();
    const futureMeals = await knex("meal").where("event_date", ">", today);
    if (futureMeals.length === 0) {
      res.status(204).json(futureMeals);
    }
    res.status(200).json(futureMeals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Respond with all meals in the past (relative to the when datetime) - /past-meals

app.get("/past-meals", async (req, res) => {
  try {
    const today = new Date();
    const pastMeals = await knex("meal").where("event_date", "<", today);
    if (pastMeals.length === 0) {
      res.status(204).json(pastMeals);
    }
    res.status(200).json(pastMeals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Respond with all meals sorted by ID - /all-meals

app.get("/all-meals", async (req, res) => {
  try {
    const allMeals = await knex("meal").orderBy("id");
    res.status(200).json(allMeals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Respond with the first meal (meaning with the minimum id) - /first-meal

app.get("/first-meal", async (req, res) => {
  try {
    const firstMeal = await knex("meal").orderBy("id").first();
    if (firstMeal !== 0) {
      res.status(200).json(firstMeal);
    } else {
      res.status(404).send("There is no first meal");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Respond with the last meal (meaning with the maximum id) -/last-meal

app.get("/last-meal", async (req, res) => {
  try {
    const lastMeal = await knex("meal").orderBy("id", "desc").first();
    if (lastMeal !== 0) {
      res.status(200).json(lastMeal);
    } else {
      res.status(404).send("There is no last meal");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

if (process.env.API_PATH) {
  app.use(process.env.API_PATH, router);
} else {
  throw "API_PATH is not set. Remember to set it in your .env file";
}

// for the frontend. Will first be covered in the react class
app.use("*", (req, res) => {
  res.sendFile(path.join(`${buildPath}/index.html`));
});

module.exports = app;
