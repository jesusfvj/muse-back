const express = require("express");
const uploadSongsRouter = express.Router();
const { register } = require("../controllers/uploadSongs");

uploadSongsRouter.post("/register", register);

module.exports = uploadSongsRouter;
