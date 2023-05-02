const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

module.exports = app;
