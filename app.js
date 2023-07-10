const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");

require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

app.use("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
