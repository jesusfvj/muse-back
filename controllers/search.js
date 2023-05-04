const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Album = require("../models/Album");
const Track = require("../models/Track");

const search = async (req, res) => {
  const { query } = req.params;
  try {
    const users = await User.find({
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
      results: { users, albums, tracks, playlists },
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = { search };
