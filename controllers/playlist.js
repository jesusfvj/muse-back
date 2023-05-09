const Playlist = require("../models/Playlist");

const followPlaylists = async (req, res) => {
    const { loggedUserId, playlistId, isAdded } = req.body
    try {
      const loggedUser = await User.findOne({ _id: loggedUserId });
      if (isAdded) {
        await loggedUser.updateOne({ $addToSet: { playlists: { $each: playlistId } } });
        return res.status(200).json({
          ok: true,
          loggedUserId,
          playlistId,
          isAdded
        });
      } else {
        await loggedUser.updateOne({ $pull: { playlists: { $in: playlistId } } });
        return res.status(200).json({
          ok: true,
          loggedUserId,
          playlistId,
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
  
  const createPlaylist = async (req, res) => {
    const { loggedUserId, newName, thumbnailUrl } = req.body
    try {
      const loggedUser = await User.findOne({ _id: loggedUserId });
      const newPlaylist = new Playlist({
        name: newName,
        user: loggedUserId,
        thumbnailUrl
      });
      await newPlaylist.save()
      await loggedUser.updateOne({ $push: { playlists: newPlaylist._id } });
      return res.status(201).json({
        ok: true,
        newPlaylist,
      });
    } catch (error) {
      return res.status(503).json({
        ok: false,
        msg: "Oops, something happened",
      });
    }
  }
  
  const deletePlaylist = async (req, res) => {
    const { loggedUserId, playlistId } = req.body
  
    try {
      const loggedUser = await User.findOne({ _id: loggedUserId });
      const playlistToDelete = await Playlist.findOne({ _id: playlistId });
      if (playlistToDelete.user.toString() !== loggedUserId) {
        return res.status(401).json({
          ok: false,
          message: "You are not the owner of this playlist",
        })
      }
      await loggedUser.updateOne({ $pull: { playlists: playlistId } });
      await Playlist.findByIdAndDelete(playlistId)
        .then((deletedPlaylist) => {
          return res.status(200).json({
            ok: true,
            deletedPlaylist,
          });
        })
    } catch (error) {
      return res.status(503).json({
        ok: false,
        msg: "Oops, something happened",
      });
    }
  }
  
  const updatePlaylist = async (req, res) => {
    const   { loggedUserId, playlistId, newName, thumbnailUrl } = req.body
    try {
      const playlistToUpdate = await Playlist.findOne({ _id: playlistId });
      if (playlistToUpdate.user.toString() !== loggedUserId) {
        return res.status(401).json({
          ok: false,
          message: "You are not the owner of this playlist",
        })
      }
      const oldName = playlistToUpdate.name
      await playlistToUpdate.updateOne({ name: newName });
      await playlistToUpdate.updateOne({ thumbnail: thumbnailUrl });
      return res.status(200).json({
        ok: true,
        playlistToUpdate,
        oldName,
        newName
      });
    } catch (error) {
      return res.status(503).json({
        ok: false,
        msg: "Oops, something happened",
      });
    }
}
const isPrivate = async (req, res) => {
  const { loggedUserId, playlistId, isPrivate, } = req.body
  try {
    const playlistToUpdate = await Playlist.findOne({ _id: playlistId });
    if (playlistToUpdate.user.toString() !== loggedUserId) {
      return res.status(401).json({
        ok: false,
        message: "You are not the owner of this playlist",
      });
    }
    await playlistToUpdate.updateOne({ isPrivate: isPrivate });
    return res.status(200).json({
      ok: true,
      playlistId,
      isPrivate
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
}
module.exports = {followPlaylists, updatePlaylist, deletePlaylist, createPlaylist, isPrivate}