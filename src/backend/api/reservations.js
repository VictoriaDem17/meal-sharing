const express = require("express");
const router = express.Router();
const knex = require("../database");

// GET - /api/reservations - returns all reservations
// routes should respond with JSON with the available columns from the associated tables

router.get("/", async (req, res) => {
  try {
    const allReservations = await knex("reservation");
    res.status(200).json(allReservations);
  } catch (error) {
    console.error("error");
    res.status(500).send("Server Error");
  }
});

// POST - /api/reservations - adds a new reservation to the database
// endpoints will require a request body - the information that database will be updated with
// if request is successful, the response status code should be 201 Created

router.post("/", async (req, res) => {
  try {
    const newReservation = req.body;
    const reservation = await knex("reservation").insert(newReservation);
    if (reservation) {
      res.status(201).json({
        message: "New reservation is created",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// GET - /api/reservations/:id	- returns the reservation by id
// routes should handle the case when the row with that ID does not exist

router.get("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservation = await knex("reservation")
      .where("id", "=", reservationId)
      .select();

    if (reservation.length === 0) {
      res.status(404).send("Reservation doesn't exist");
      return;
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// PUT - /api/reservations/:id	- updates the reservation by id
// endpoints will require a request body - the information that database will be updated with
// routes should handle the case when the row with that ID does not exist

router.put("/:id", async (req, res) => {
  try {
    const updatedReservation = req.body;
    const reservationId = req.params.id;
    const reservation = await knex("reservation")
      .where("id", reservationId)
      .update(updatedReservation);
    if (reservation) {
      res.status(200).json({
        message: `Reservation with id - ${reservationId} was updated`,
      });
    } else {
      res.status(404).send("Reservation doesn't exist");
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// DELETE - /api/reservations/:id - deletes the reservations by id
// routes should handle the case when the row with that ID does not exist

router.delete("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const deletedReservation = await knex("reservation")
      .where("id", reservationId)
      .del();
    if (deletedReservation) {
      res.status(200).send("Reservation is successfully deleted");
    } else {
      res.status(404).send("Reservation doesn't exist");
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
    throw error;
  }
});

module.exports = router;
