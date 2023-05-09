const express = require("express");
const trackRouter = express.Router();
const { addTracks, uploadNewSongs } = require("../controllers/track");
const multer = require('multer');

/* const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  }); */

const upload = multer({ dest: './uploads' });

// addPlaylist body = { loggedUserId, playlistId, isAdded:Boolean }
trackRouter.post("/addToLibrary", addTracks);
trackRouter.post("/uploadNewSongs/:userId", upload.any(), uploadNewSongs);

module.exports = trackRouter;