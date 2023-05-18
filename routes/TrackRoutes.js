const express = require("express");
const trackRouter = express.Router();
const checkJWT = require("../middlewares/checkJWT");
const {
  addTracks,
  uploadNewSongs,
  getTracks,
  getTrackById,
  updateTrack,
  deleteTrack
} = require("../controllers/track");
const multer = require("multer");

const upload = multer({ dest: "./uploads" });

// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
trackRouter.post("/addToLibrary", checkJWT, addTracks);
trackRouter.post("/uploadNewSongs/:userId", checkJWT, upload.any(), uploadNewSongs);
trackRouter.get("/", checkJWT, getTracks);
trackRouter.get("/id/:id", checkJWT, getTrackById);
trackRouter.put('/update/:trackId', checkJWT, upload.any(), updateTrack);
trackRouter.post("/delete", checkJWT, deleteTrack);

module.exports = trackRouter;
