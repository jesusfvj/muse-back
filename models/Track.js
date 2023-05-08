const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  url: {
    type: String,
    required: true,
  },
  followedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  thumbnail: {
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
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;


