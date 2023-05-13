const Playlist = require("../models/Playlist");
const User = require("../models/User");
const { uploadImage, deleteCloudinaryFile } = require("../utils/cloudinary");
const fs = require("fs-extra");

const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      isPrivate: false,
    })
      .sort({ followedBy: -1 })
      .limit(20);

    return res.status(200).json({
      ok: true,
      playlists,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const followPlaylists = async (req, res) => {
  const { loggedUserId, playlistId, isAdded } = req.body;

  try {
    const loggedUser = await User.findOne({
      _id: loggedUserId,
    });
    if (isAdded) {
      await loggedUser.updateOne({
        $addToSet: {
          followedPlaylists: {
            $each: [playlistId],
          },
        },
      });

      await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
        },
        {
          $addToSet: {
            followedBy: {
              $each: [loggedUserId],
            },
          },
        }
      );

      return res.status(200).json({
        ok: true,
        loggedUserId,
        playlistId,
        isAdded,
      });
    } else {
      await loggedUser.updateOne({
        $pull: {
          followedPlaylists: {
            $in: playlistId,
          },
        },
      });

      await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
        },
        {
          $pull: {
            followedBy: {
              $in: loggedUserId,
            },
          },
        }
      );
      return res.status(200).json({
        ok: true,
        loggedUserId,
        playlistId,
        isAdded,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const createPlaylist = async (req, res) => {
  const { name, isPrivate } = JSON.parse(req.body.imagePlaylistData);

  const userId = req.params.userId;
  const file = req.files[0];

  try {
    if (!file) {
      return res.status(503).json({
        ok: false,
        msg: "No files uploaded",
      });
    }
    if (file) {
      const loggedUser = await User.findOne({
        _id: userId,
      });
      const newPlaylist = new Playlist({
        name: name,
        user: userId,
        isPrivate: isPrivate,
      });
      //Upload thumbnail to Cloudinary
      const resultImage = await uploadImage(file.path);
      newPlaylist.color = resultImage.colors[0][0];
      newPlaylist.thumbnail = resultImage.secure_url;
      newPlaylist.thumbnailCloudinaryId = resultImage.public_id;
      await newPlaylist.save();
      await loggedUser.updateOne({
        $push: {
          playlists: newPlaylist._id,
        },
      });
      await fs.unlink(file.path);
      return res.status(201).json({
        ok: true,
        newPlaylist,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const deletePlaylist = async (req, res) => {
  const { loggedUserId, playlistId } = req.body;

  try {
    const loggedUser = await User.findOne({
      _id: loggedUserId,
    });
    const playlistToDelete = await Playlist.findOne({
      _id: playlistId,
    });
    if (playlistToDelete.user.toString() !== loggedUserId) {
      return res.status(401).json({
        ok: false,
        message: "You are not the owner of this playlist",
      });
    }
    await loggedUser.updateOne({
      $pull: {
        playlists: playlistId,
      },
    });

    const response = await deleteCloudinaryFile(
      playlistToDelete.thumbnailCloudinaryId
    );
    if (!response.result === "ok") {
      return res.status(503).json({
        ok: false,
        msg: response.result,
      });
    }

    await Playlist.findByIdAndDelete(playlistId).then((deletedPlaylist) => {
      return res.status(200).json({
        ok: true,
        deletedPlaylist,
      });
    });
    await User.updateMany(
      {
        followedPlaylists: playlistId,
      },
      {
        $pull: {
          followedPlaylists: playlistId,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const getPlaylistById = async (req, res) => {
  const { id } = req.params;

  if (id.length !== 24) {
    return res.status(200).json({
      ok: false,
    });
  }

  try {
    const playlist = await Playlist.findOne({
      _id: id,
    }).populate({
      path: "tracks",
      populate: {
        path: "artist",
      },
    });

    if (!playlist) {
      return res.status(404).json({
        ok: false,
        msg: "No playlists with this id",
      });
    }

    return res.status(200).json({
      ok: true,
      playlist,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const isPrivate = async (req, res) => {
  const { loggedUserId, playlistId, isPrivate } = req.body;

  try {
    const playlistToUpdate = await Playlist.findOne({
      _id: playlistId,
    });

    if (playlistToUpdate.user.toString() !== loggedUserId) {
      return res.status(401).json({
        ok: false,
        message: "You are not the owner of this playlist",
      });
    }
    await playlistToUpdate.updateOne({
      isPrivate: !isPrivate,
    });

    if (!isPrivate) {
      await User.updateMany(
        {
          followedPlaylists: playlistId,
        },
        {
          $pull: {
            followedPlaylists: playlistId,
          },
        }
      );
    }

    return res.status(200).json({
      ok: true,
      playlistToUpdate,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};
const addTracks = async (req, res) => {
  const { loggedUserId, playlistId, trackId, isAdded } = req.body;
  try {
    const playlistToUpdate = await Playlist.findOne({
      _id: playlistId,
    });
    if (!playlistToUpdate) {
      return res.status(401).json({
        ok: false,
        message: "Error, this playlist doesn't exist",
      });
    }
    if (playlistToUpdate.user.toString() !== loggedUserId) {
      return res.status(401).json({
        ok: false,
        message: "You are not the owner of this playlist",
      });
    }
    await playlistToUpdate.updateOne({
      $addToSet: {
        tracks: {
          $each: trackId,
        },
      },
    });
    return res.status(200).json({
      ok: true,
      playlistId,
      addedTracks: trackId,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const duplicatePlaylist = async (req, res) => {
  const { loggedUserId, playlistId } = req.body;
  try {
    const playlistToDuplicate = await Playlist.findOne({
      _id: playlistId,
    });
    const loggedUser = await User.findById(loggedUserId).populate("playlists");
    if (playlistToDuplicate.user.toString() === loggedUserId) {
      return res.status(400).json({
        ok: false,
        msg: "This is actually your playlist",
      });
    }
    if (playlistToDuplicate.isPrivate === true) {
      return res.status(401).json({
        ok: false,
        msg: "This playlist is private!! How did you get there?",
      });
    }
    if (playlistToDuplicate.tracks.length === 0) {
      return res.status(401).json({
        ok: false,
        msg: "This playlist does not have any song to duplicate",
      });
    }
    const userPlaylists = loggedUser.playlists;
    const foundPlaylist = userPlaylists.some((playlist) =>
      playlist.copyFrom.toString().includes(playlistId)
    );
    if (foundPlaylist) {
      const playlist = userPlaylists.find(
        (playlist) => playlist.copyFrom.toString() === playlistId
      );
      const duplicatedTracksIds = playlist.tracks.map((track) => track);
      const missingTracks = playlistToDuplicate.tracks.filter(
        (track) => !duplicatedTracksIds.includes(track)
      );

      if (missingTracks.length !== 0) {
        playlist.updateOne({
          $push: {
            tracks: {
              $each: missingTracks,
            },
          },
        });
        return res.status(200).json({
          ok: true,
          msg: "This playlist is already in your library. The missing songs have been added to the corresponding playlist.",
          missingTracks,
        });
      }
      return res.status(200).json({
        ok: false,
        msg: "This playlist has already been duplicated",
        playlist: playlist.tracks,
        playlistToDuplicate: playlistToDuplicate.tracks,
        missingTracks,
      });
    }
    const newPlaylist = new Playlist({
      name: `${playlistToDuplicate.name} copy`,
      user: loggedUserId,
      thumbnail: playlistToDuplicate.thumbnail,
      thumbnailCloudinaryId: playlistToDuplicate.thumbnailCloudinaryId,
      tracks: playlistToDuplicate.tracks,
      copyFrom: playlistId,
    });
    await newPlaylist.save();
    await loggedUser.updateOne({
      $push: {
        playlists: newPlaylist._id,
      },
    });
    return res.status(201).json({
      ok: true,
      msg: `The playlist ${playlistToDuplicate.name} have been duplicated!`,
      newPlaylist,
      loggedUser: loggedUser.playlists,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Oops, something happened",
      error,
    });
  }
};

const updatePlaylist = async (req, res) => {
  const { name } = JSON.parse(req.body.imagePlaylistData);
  const playlistId = req.params.playlistId;
  const file = req.files[0];

  try {
    if (!file) {
      return res.status(503).json({
        ok: false,
        msg: "No files uploaded",
      });
    }
    if (file) {
      //Upload thumbnail to Cloudinary
      const resultImage = await uploadImage(file.path);
      const url = resultImage.secure_url;
      const cloudinaryId = resultImage.public_id;
      const color = resultImage.colors[0][0];

      const playlistBeforeUpdate = await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
        },
        {
          $set: {
            name: name,
            thumbnail: url,
            color: color,
            thumbnailCloudinaryId: cloudinaryId,
          },

          new: false,
        }
      );

      const response = await deleteCloudinaryFile(
        playlistBeforeUpdate.thumbnailCloudinaryId
      );
      if (!response.result === "ok") {
        return res.status(503).json({
          ok: false,
          msg: response.result,
        });
      }

      await fs.unlink(file.path);

      return res.status(201).json({
        ok: true,
        newName: name,
        thumbnail: url,
        color: color,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

module.exports = {
  getPlaylists,
  getPlaylistById,
  followPlaylists,
  updatePlaylist,
  deletePlaylist,
  createPlaylist,
  isPrivate,
  duplicatePlaylist,
  addTracks,
};
