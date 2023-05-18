const express = require("express");
const trackRouter = express.Router();
const { likeTracks, getTracks } = require("../controllers/track");

const upload = multer({ dest: "./uploads" });

// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
trackRouter.post("/likeTracks", likeTracks);
trackRouter.get("/getTracks", getTracks);


module.exports = trackRouter;
