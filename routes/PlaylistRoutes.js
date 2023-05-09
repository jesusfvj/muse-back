const express = require("express");
const playlistRouter = express.Router();
const {
  followPlaylists,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylists,
  getPlaylistById,
  isPrivate,
} = require("../controllers/playlist");

playlistRouter.get("/", getPlaylists);
playlistRouter.get("/id/:id", getPlaylistById);
// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
playlistRouter.post("/follow", followPlaylists);
// createDeleteUpdatePlaylist body = { loggedUserId, playlistId, newName, thumbnailUrl, action }
// Create = { loggedUserId, newName, thumbnailUrl:Optional, action="create" }
playlistRouter.post("/create", createPlaylist);
// Delete = { loggedUserId, playlistId, action="delete" }
playlistRouter.delete("/delete", deletePlaylist);
// Update = { loggedUserId, playlistId, newName:Optional, thumbnailUrl:Optional, action="update" }
playlistRouter.put("/update", updatePlaylist);
playlistRouter.put("/togglevisibility", isPrivate);

// userRouter.delete("/delete", deleteUser);

module.exports = playlistRouter;
