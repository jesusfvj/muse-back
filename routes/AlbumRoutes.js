const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const { getAlbums, getAlbumById, deleteAlbum, updateAlbum } = require("../controllers/album");

const albumRouter = express.Router();
albumRouter.get("/", getAlbums);
albumRouter.get("/:id", getAlbumById);
albumRouter.post("/delete", deleteAlbum);
albumRouter.put('/update/:albumId', upload.any(), updateAlbum);
module.exports = albumRouter;
