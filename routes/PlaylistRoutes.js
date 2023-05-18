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
// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
playlistRouter.post("/follow", checkJWT, followPlaylists);
// createDeleteUpdatePlaylist body = { loggedUserId, playlistId, newName, thumbnailUrl, action }
// Create = { loggedUserId, newName, thumbnailUrl:Optional, action="create" }
playlistRouter.post("/create/:userId", checkJWT, upload.any(), createPlaylist);
// Delete = { loggedUserId, playlistId, action="delete" }
playlistRouter.post("/delete", checkJWT, deletePlaylist);
// Update = { loggedUserId, playlistId, newName:Optional, thumbnailUrl:Optional, action="update" }
playlistRouter.put("/togglevisibility", checkJWT, isPrivate);
playlistRouter.put("/addToPlaylist", checkJWT, addTracks);
playlistRouter.post("/duplicatePlaylist", checkJWT, duplicatePlaylist);
playlistRouter.put('/update/:playlistId', checkJWT, upload.any(), updatePlaylist);


// userRouter.delete("/delete", deleteUser);

module.exports = playlistRouter;
