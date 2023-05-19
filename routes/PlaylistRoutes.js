const express = require("express");
const multer = require("multer");
const playlistRouter = express.Router();
const {
  followPlaylists,
  createPlaylist,
  deletePlaylist,
  getPlaylists,
  getPlaylistById,
  isPrivate,
  addTracks,
  duplicatePlaylist,
  updatePlaylist,
} = require("../controllers/playlist");
const checkJWT = require("../middlewares/checkJWT");

const upload = multer({ dest: "./uploads" });

playlistRouter.get("/", checkJWT, getPlaylists);
playlistRouter.get("/id/:id", checkJWT, getPlaylistById);
playlistRouter.post("/follow", checkJWT, followPlaylists);
playlistRouter.post("/create/:userId", checkJWT, upload.any(), createPlaylist);
playlistRouter.post("/delete", checkJWT, deletePlaylist);
playlistRouter.put("/togglevisibility", checkJWT, isPrivate);
playlistRouter.put("/addToPlaylist", checkJWT, addTracks);
playlistRouter.post("/duplicatePlaylist", checkJWT, duplicatePlaylist);
playlistRouter.put('/update/:playlistId', checkJWT, upload.any(), updatePlaylist);

module.exports = playlistRouter;