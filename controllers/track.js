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

const addTracks = async (req, res) => {
  const { loggedUserId, trackId, isAdded } = req.body;
  try {
    const loggedUser = await User.findOne({
      _id: loggedUserId,
    });
    const track = await Track.findOne({
      _id: trackId,
    });
    if (isAdded) {
      await loggedUser.updateOne({
        $addToSet: {
          tracks: {
            $each: trackId,
          },
        },
      });
      await track.updateOne({ $push: { followedBy: loggedUserId } });
      return res.status(200).json({
        ok: true,
        loggedUserId,
        trackId,
        isAdded,
      });
    } else {
      await loggedUser.updateOne({
        $pull: {
          tracks: {
            $in: trackId,
          },
        },
      });
      await track.updateOne({ $pull: { followedBy: loggedUserId } });
      return res.status(200).json({
        ok: true,
        loggedUserId,
        trackId,
        isAdded,
      });
    }
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const uploadNewSongs = async (req, res) => {
  try {
    const dataFiles = req.body;
    const userId = req.params.userId;

    if (!req.files) {
      return res.status(503).json({
        ok: false,
        msg: "No files uploaded",
      });
    }

    if (req.files) {
      const arrayIdTracks = [];
      let albumThumbnailUrl = "";
      let albumCloudinaryId = "";
      let albumNameNewAlbmum = "";

      //Function to group the files in image-audio pairs inside an object
      const filteredFiles = grouperDataFunction(req.files);

      await Promise.all(
        filteredFiles.map(async ({ audio, image }, index) => {
          const { songTitle, genre, albumName } = JSON.parse(
            dataFiles[`dataFile${index + 1}`]
          );

          const newTrack = new Track({
            name: songTitle,
            genre: genre,
            artist: userId,
          });

          //Upload tracks and thumbnails to Cloudinary
          const resultImage = await uploadImage(image.path);
          newTrack.thumbnailUrl = resultImage.secure_url;
          newTrack.thumbnailCloudinaryId = resultImage.public_id;

          albumThumbnailUrl = resultImage.secure_url;
          albumCloudinaryId = resultImage.public_id;

          const resultSong = await uploadSong(audio.path);
          newTrack.trackUrl = resultSong.secure_url;
          newTrack.trackCloudinaryId = resultSong.public_id;
          //Get the duration of the song from the Cloudinary API
          const formattedDuration = formatDuration(resultSong.duration);
          newTrack.duration = formattedDuration;

          if (!resultImage && !resultSong) {
            return res.status(503).json({
              ok: false,
              msg: "There was a problem uploading the files",
            });
          }

          //Delete the files in the uploads folder
          await fs.unlink(image.path);
          await fs.unlink(audio.path);

          arrayIdTracks.push(newTrack._id);

          if (albumName) {
            albumNameNewAlbmum = albumName;
          }

          await newTrack.save();
        })
      );

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            uploadedTracks: arrayIdTracks,
          },
        }
      );

      if (albumNameNewAlbmum !== "") {
        const newAlbum = new Album({
          name: albumNameNewAlbmum,
          artist: userId,
          /* genre */
          thumbnailUrl: albumThumbnailUrl,
          thumbnailCloudinaryId: albumCloudinaryId,
          songs: arrayIdTracks,
        });

        await newAlbum.save();

        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              uploadedAlbums: newAlbum._id,
            },
          }
        );

        //Update the album field in the tracks with the _id from the just created album
        try {
          const update = {
            $set: {
              album: newAlbum._id,
            },
          };

          await Track.updateMany(
            {
              _id: {
                $in: arrayIdTracks,
              },
            },
            update,
            {
              new: true,
            }
          );
        } catch (error) {
          return res.status(503).json({
            ok: false,
            msg: "Error updating values",
          });
        }
      }
    }

    deleteFilesFromUploadFolder("../uploads");
    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: "Something happened...",
    });
  }
};

const getTrackById = async (req, res) => {
  const { id } = req.params;

  try {
    let DBtrack = await Track.findOne({ _id: id }).populate('artist');

    const featuredIn = await Playlist.find({
      tracks: { $in: id },
      isPrivate: false,
    });

    if (!DBtrack) {
      return res.status(503).json({
        ok: false,
        msg: "Could not find the track",
      });
    }
    const track = { DBtrack, featuredIn };

    return res.status(200).json({
      ok: true,
      track,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened",
    });
  }
};

const updateTrack = async (req, res) => {
  const { name } = JSON.parse(req.body.imagePlaylistData);
  const trackId = req.params.trackId;
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

      const trackBeforeUpdate = await Track.findOneAndUpdate(
        {
          _id: trackId,
        },
        {
          $set: {
            name: name,
            thumbnailUrl: url,
            thumbnailCloudinaryId: cloudinaryId,
          },
        },
        {
          new: false,
        }
      );

      const response = await deleteCloudinaryFile(
        trackBeforeUpdate.thumbnailCloudinaryId
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

const deleteTrack = async (req, res) => {
  const { loggedUserId, trackId } = req.body;

  try {
    const loggedUser = await User.findOne({
      _id: loggedUserId,
    });
    const trackToDelete = await Track.findOne({
      _id: trackId,
    });

    if (trackToDelete.artist.toString() !== loggedUserId) {
      return res.status(401).json({
        ok: false,
        message: "You are not the owner of this track",
      });
    }
    await loggedUser.updateOne({
      $pull: {
        tracks: trackId,
      },
    });

    const responseImage = await deleteCloudinaryFile(
      trackToDelete.thumbnailCloudinaryId
    );
    if (!responseImage.result === "ok") {
      return res.status(503).json({
        ok: false,
        msg: responseImage.result,
      });
    }

    const responseSong = await deleteCloudinaryFile(
      trackToDelete.trackCloudinaryId
    );
    if (!responseSong.result === "ok") {
      return res.status(503).json({
        ok: false,
        msg: responseSong.result,
      });
    }

    await Track.findByIdAndDelete(trackId).then((deletedTrack) => {
      return res.status(200).json({
        ok: true,
        deletedTrack,
      });
    });
    await Playlist.updateMany(
      {
        tracks: trackId,
      },
      {
        $pull: {
          tracks: trackId,
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

module.exports = {
  addTracks,
  uploadNewSongs,
  getTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
};
