const express = require("express");
const { getAlbums } = require("../controllers/album");

const albumRouter = express.Router();
albumRouter.get("/", getAlbums);
module.exports = albumRouter;
