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
const boardRouter = require("./routes/boardRouter");

// Routes
app.use("/org", orgRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter);

module.exports = app;
