const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "./uploads" });
const { getAlbums, getAlbumById, deleteAlbum, updateAlbum } = require("../controllers/album");
const checkJWT = require("../middlewares/checkJWT");

const albumRouter = express.Router();
albumRouter.get("/", checkJWT, getAlbums);
albumRouter.get("/:id", checkJWT, getAlbumById);
albumRouter.post("/delete", checkJWT, deleteAlbum);
albumRouter.put('/update/:albumId', checkJWT, upload.any(), updateAlbum);
module.exports = albumRouter;
