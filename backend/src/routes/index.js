const express = require("express");

const VotesController = require("../controllers/VotesController");
const routes = express.Router();

routes.get("/", (req, res) => {
  res.json({ wololo: "teste" });
});

routes.post("/start/:room", VotesController.start);
routes.post("/votes/:room", VotesController.store);

module.exports = routes;
