const Track = require("../models/Track");
const Album = require("../models/Album");
const User = require("../models/User");
const fs = require("fs-extra");

const {
  uploadImage,
  uploadSong,
  deleteCloudinaryFile,
} = require("../utils/cloudinary");
const {
  grouperDataFunction,
  deleteFilesFromUploadFolder,
  formatDuration,
  getAudioDuration,
} = require("../utils/uploadNewSongsFunctions");
const Playlist = require("../models/Playlist");

const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find({})
      .populate("artist")
      .sort({ followedBy: -1 })
      .limit(20);

    return res.status(200).json({
      ok: true,
      tracks,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const getTracks = async (req, res) => {
    const {loggedUserId, query = ""} = req.body
    try {
        const loggedUser = await User.findOne({ _id: loggedUserId });
        const trackIds = loggedUser.tracks;
        const tracks = await Track.find({ 
            _id: { $in: trackIds },
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { genre: { $regex: query, $options: 'i' } },
              { artist: { $regex: query, $options: 'i' } },
            ]
          });
          return res.status(200).json({
            ok: true,
            loggedUserId,
            tracks
        });
    } catch (error) {
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
   
}
const likeTracks = async (req, res) => {
    const { loggedUserId, trackId, isAdded } = req.body
    try {
        const loggedUser = await User.findOne({ _id: loggedUserId });
        if (isAdded) {
            await loggedUser.updateOne({ $addToSet: { tracks: { $each: trackId } } });
            return res.status(200).json({
                ok: true,
                loggedUserId,
                trackId,
                isAdded
            });
        } else {
            await loggedUser.updateOne({ $pull: { tracks: { $in: trackId } } });
            return res.status(200).json({
                ok: true,
                loggedUserId,
                trackId,
                isAdded
            });
        }
    } catch (error) {
        return res.status(503).json({
            ok: false,
            msg: "Oops, something happened",
        });
    }
}

module.exports = { likeTracks, getTracks }