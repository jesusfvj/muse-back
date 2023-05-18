const express = require("express");
const { search } = require("../controllers/search");
const searchRouter = express.Router();
const checkJWT = require("../middlewares/checkJWT");

searchRouter.get("/:query/:uid", checkJWT, search);

module.exports = searchRouter;
