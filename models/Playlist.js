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
    default:[]
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  thumbnailCloudinaryId: {
    type: String,
    required: true,
  },
  color:{
    type: String
  },
  copyFrom:{
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
