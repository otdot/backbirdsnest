const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const droneRouter = require("../routes/drones");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/.netlify/functions/drones", droneRouter);

module.exports.handler = serverless(app);
