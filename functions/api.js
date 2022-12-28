const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const indexRouter = require("../routes/index");
const droneRouter = require("../routes/drones");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

router.use("/.netlify/functions", indexRouter);
router.use("/.netlify/functions/test", (_req, res) => {
  res.send("test response");
});
router.use("/.netlify/functions/drones", droneRouter);
app.use("/", router);
module.exports.handler = serverless(app);
