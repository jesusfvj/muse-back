const express = require("express");
const { getAlbums, getAlbumById } = require("../controllers/album");

const albumRouter = express.Router();
albumRouter.get("/", getAlbums);
albumRouter.get("/:id", getAlbumById);
module.exports = albumRouter;
