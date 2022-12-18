const express = require("express");
const { updateDroneCache } = require("../services/droneServices");

const router = express.Router();

/* GET users listing. */

router.get("/cache", async (_req, res) => {
  const droneCache = await updateDroneCache();

  return droneCache.has("drone-list")
    ? res.json(droneCache.get("drone-list")).status(200)
    : res.send("No drones saved in cache").status(204);
});

module.exports = router;
