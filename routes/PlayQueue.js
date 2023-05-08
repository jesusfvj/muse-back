const express = require("express");
const {  } = require("../controllers/");
const searchRouter = express.Router();

searchRouter.get("/playQueue", search);

module.exports = searchRouter;
