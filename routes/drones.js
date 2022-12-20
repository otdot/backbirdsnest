const express = require("express");
const {
  updateDroneCache,
  getDroneOwnerDetails,
  getDronePositions,
} = require("../services/droneServices");

const router = express.Router();

router.get("/positions", async (_req, res) => {
  const details = await getDronePositions();

  return res.json(details).status(200);
});

router.get("/cache", async (_req, res) => {
  const droneCache = await updateDroneCache();
  return res
    .json(droneCache.keys().map((key) => droneCache.get(key)))
    .status(200);
});
module.exports = router;
