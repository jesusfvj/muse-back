const express = require("express");
const multer = require('multer');
const playlistRouter = express.Router();
const {
  followPlaylists,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylists,
  getPlaylistById,
  isPrivate,
  addTracks,
  duplicatePlaylist,
} = require("../controllers/playlist");

const upload = multer({ dest: './uploads' });

playlistRouter.get("/", getPlaylists);
playlistRouter.get("/id/:id", getPlaylistById);
// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
playlistRouter.post("/follow", followPlaylists);
// createDeleteUpdatePlaylist body = { loggedUserId, playlistId, newName, thumbnailUrl, action }
// Create = { loggedUserId, newName, thumbnailUrl:Optional, action="create" }
playlistRouter.post("/create/:userId", upload.any(), createPlaylist);
// Delete = { loggedUserId, playlistId, action="delete" }
playlistRouter.post("/delete", deletePlaylist);
// Update = { loggedUserId, playlistId, newName:Optional, thumbnailUrl:Optional, action="update" }
playlistRouter.put("/update", updatePlaylist);
playlistRouter.put("/togglevisibility", isPrivate);
playlistRouter.put("/addToPlaylist", addTracks);
playlistRouter.put("/duplicatePlaylist", duplicatePlaylist);

// userRouter.delete("/delete", deleteUser);

module.exports = playlistRouter;
