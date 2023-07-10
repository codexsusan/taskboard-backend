const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());

// Routers
const orgRouter = require("./routes/orgRouter");
const userRouter = require("./routes/userRouter");
// Routes
app.use("/org", orgRouter);
app.use("/user", userRouter);

module.exports = app;
