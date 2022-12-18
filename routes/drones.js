var express = require("express");
const { droneInsideCircle } = require("../services/droneServices");
var router = express.Router();

/* GET users listing. */
router.get("/", async (_req, res, _next) => {
  const drones = await droneInsideCircle();

  res.json(drones);
});

module.exports = router;
