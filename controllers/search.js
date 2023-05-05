const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Album = require("../models/Album");
const Track = require("../models/Track");
const mongoose = require("mongoose");

const search = async (req, res) => {
  const { query, uid } = req.params;
  const objectId = new mongoose.Types.ObjectId(uid);
  try {
    const users = await User.find({
      _id: { $ne: objectId },
      role: "user",
      fullName: { $regex: new RegExp(query, "i") },
    });
    const artists = await User.find({
      _id: { $ne: objectId },
       role: "artist",
      fullName: { $regex: new RegExp(query, "i") },
    });
    const albums = await Album.find({
      name: { $regex: new RegExp(query, "i") },
    });
    const tracks = await Track.find({
      name: { $regex: new RegExp(query, "i") },
    });
    const playlists = await Playlist.find({
      name: { $regex: new RegExp(query, "i") },
    });

    return res.status(200).json({
      ok: true,
      results: { users, albums, tracks, playlists, artists },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = { search };
