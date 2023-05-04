const express = require("express");
const trackRouter = express.Router();
const { addTracks } = require("../controllers/track");


// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
trackRouter.post("/addToLibrary", addTracks);


module.exports = trackRouter;
