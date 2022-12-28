const serverless = require("serverless-http");
var express = require("express");
const cors = require("cors");

var indexRouter = require("../routes/index");
var droneRouter = require("../routes/drones");

var app = express();

// view engine setup
app.use(express.json());
app.use(cors());
app.use(express.static("../dist"));

app.use("/.netlify/functions", indexRouter);
app.use("/.netlify/functions/drones", droneRouter);

module.exports.handler = serverless(app);
