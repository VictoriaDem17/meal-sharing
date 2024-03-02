const express = require("express");
const router = express.Router();
const knex = require("../database");

// GET - /api/meals	- returns all meals
// routes should respond with JSON with the available columns from the associated tables

router.get("/", async (req, res) => {
  try {
    const allMeals = await knex("meal");
    res.status(200).json(allMeals);
  } catch (error) {
    console.error("error");
    res.status(500).send("Server Error");
  }
});

// POST - /api/meals - adds a new meal to the database
// endpoints will require a request body - the information that database will be updated with;
// if request is successful, the response status code should be 201 Created

router.post("/", async (req, res) => {
  try {
    const newMeal = req.body;
    const meal = await knex("meal").insert(newMeal);
    if (meal) {
      res.status(201).json({
        message: "New meal is created",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// GET - /api/meals/:id	- returns the meal by id
// routes should handle the case when the row with that ID does not exist

router.get("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const meal = await knex("meal").where("id", "=", mealId).select();

    if (meal.length === 0) {
      res.status(404).send("Meal doesn't exist");
      return;
    }
    res.status(200).json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// PUT - /api/meals/:id	- updates the meal by id
// endpoints will require a request body - the information that database will be updated with
// routes should handle the case when the row with that ID does not exist

router.put("/:id", async (req, res) => {
  try {
    const updatedMeal = req.body;
    const mealId = req.params.id;
    const meal = await knex("meal").where("id", mealId).update(updatedMeal);
    if (meal) {
      res.status(200).json({
        message: `Meal with id - ${mealId} was updated`,
      });
    } else {
      res.status(404).send("Meal doesn't exist");
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// DELETE - /api/meals/:id - deletes the meal by id
// routes should handle the case when the row with that ID does not exist

router.delete("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const deletedMeal = await knex("meal").where("id", mealId).del();
    if (deletedMeal) {
      res.status(200).send("Meal is successfully deleted");
    } else {
      res.status(404).send("Meal doesn't exist");
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
    throw error;
  }
});

module.exports = router;
