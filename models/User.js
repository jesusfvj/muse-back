const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
    default: [],
  },
  followedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
    default: [],
  },
  albums: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Album",
    required: false,
    default: [],
  },
  followedPlaylists: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Playlist",
    required: true,
    default: [],
  },
  playlists: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Playlist",
    required: true,
    default: [],
  },
  tracks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Track",
    required: true,
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin", "artist"],
    default: "user",
    required: true,
  },
  profilePhoto: {
    type: String,
    required: true,
    default: "https://spanishbit.es/no-profile.jpg",
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
