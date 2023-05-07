const express = require("express");
const { search } = require("../controllers/search");
const searchRouter = express.Router();

searchRouter.get("/:query", search);

module.exports = searchRouter;
