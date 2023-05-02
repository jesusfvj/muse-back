const { Schema, model } = require("mongoose");

const UserSchema = Schema({
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
});

module.exports = model("User", UserSchema);
