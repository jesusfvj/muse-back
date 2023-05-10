const fs = require("fs-extra");
const Track = require("../models/Track");
const Album = require("../models/Album");
const { uploadImage, uploadSong, deleteImage } = require("../utils/cloudinary");
const {
  grouperDataFunction,
  deleteFilesFromUploadFolder,
} = require("../utils/uploadNewSongsFunctions");

const getTracks = async (req, res) => {

  try {
    const tracks = await Track.find({}).populate('artist');

    return res.status(200).json({ ok: true, tracks });
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
    if (isAdded) {
      await loggedUser.updateOne({
        $addToSet: {
          tracks: {
            $each: trackId,
          },
        },
      });
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

          const resultImage = await uploadImage(image.path);
          newTrack.thumbnailUrl = resultImage.secure_url;
          albumThumbnailUrl = resultImage.secure_url;
          newTrack.thumbnailCloudinaryId = resultImage.public_id;
          albumCloudinaryId = resultImage.public_id;

          const resultSong = await uploadSong(audio.path);
          newTrack.trackUrl = resultSong.secure_url;
          newTrack.trackCloudinaryId = resultSong.public_id;

          if (!resultImage && !resultSong) {
            deleteFilesFromUploadFolder();
            return res.status(503).json({
              ok: false,
              msg: "There was a problem uploading the files",
            });
          }

          await fs.unlink(image.path);
          await fs.unlink(audio.path);

          if (albumName) {
            albumNameNewAlbmum = albumName;
            arrayIdTracks.push(newTrack._id);
          }

          await newTrack.save();
        })
      );

      if (arrayIdTracks.length !== 0) {
        const newAlbum = new Album({
          name: albumNameNewAlbmum,
          artist: userId,
          /* genre */
          thumbnailUrl: albumThumbnailUrl,
          thumbnailCloudinaryId: albumCloudinaryId,
          songs: arrayIdTracks,
        });

        await newAlbum.save();

        try {
          const update = {
            $set: {
              album: newAlbum._id,
            },
          };

          const result = await Track.updateMany(
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

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Something happened...",
    });
  }
};

module.exports = {
  addTracks,
  uploadNewSongs,
  getTracks,
};
