const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tracks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Track",
    required: true,
    default: []
  },
  followedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  thumbnail:{
    type: String,
    required: false,
    default: ""
  }
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
