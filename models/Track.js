const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  /* genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  }, */
 /*  duration: {
    type: String,
    required: true,
  }, */
  trackUrl: {
    type: String,
    required: true,
  },
  trackCloudinaryId: {
    type: String,
    required: true,
  },
  followedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  thumbnailCloudinaryId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album"
  }
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;


