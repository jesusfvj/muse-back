const express = require("express");
const trackRouter = express.Router();
const { likeTracks, getTracks } = require("../controllers/track");


// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
trackRouter.post("/likeTracks", likeTracks);
trackRouter.get("/getTracks", getTracks);


module.exports = trackRouter;
