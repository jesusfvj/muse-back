const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uploadedAt: {
    type: Date,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  thumbnail: {
    type: String,
    required: true,
  },
  songs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Track",
  },
  followedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
