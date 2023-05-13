const Album = require("../models/Album");
const User = require("../models/User");
const { deleteCloudinaryFile, uploadImage } = require("../utils/cloudinary");
const fs = require("fs-extra");
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).populate("artist").populate("songs");

    return res.status(200).json({ ok: true, albums });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const getAlbumById = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findOne({ _id: id })
      .populate("artist")
      .populate("songs");

    return res.status(200).json({ ok: true, album });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const deleteAlbum = async (req, res) => {
  const {
    loggedUserId,
    albumId
  } = req.body;

  try {
    const loggedUser = await User.findOne({
      _id: loggedUserId,
    });
    const albumToDelete = await Album.findOne({
      _id: albumId,
    });
    if (albumToDelete.artist.toString() !== loggedUserId) {
      return res.status(401).json({
        ok: false,
        message: "You are not the owner of this album",
      });
    }
    await loggedUser.updateOne({
      $pull: {
        uploadedAlbums: albumId,
      },
    });

    const response = await deleteCloudinaryFile(albumToDelete.thumbnailCloudinaryId)
    if (!response.result === "ok") {
      return res.status(503).json({
        ok: false,
        msg: response.result
      });
    }

    await Album.findByIdAndDelete(albumId).then((deletedAlbum) => {
      return res.status(200).json({
        ok: true,
        deletedAlbum,
      });
    });
    await User.updateMany({
      albums: albumId,
    }, {
      $pull: {
        albums: albumId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      msg: "Oops, something happened",
    });
  }
};

const updateAlbum = async (req, res) => {
  const {
    name
  } = JSON.parse(req.body.imagePlaylistData);
  const albumId = req.params.albumId
  const file = req.files[0]

  try {
    if (!file) {
      return res.status(503).json({
        ok: false,
        msg: "No files uploaded",
      });
    }
    if (file) {
      //Upload thumbnail to Cloudinary
      const resultImage = await uploadImage(file.path)
      const url = resultImage.secure_url
      const cloudinaryId = resultImage.public_id

      const albumBeforeUpdate = await Album.findOneAndUpdate({
        _id: albumId
      }, {
        $set: {
          name: name,
          thumbnail: url,
          thumbnailCloudinaryId: cloudinaryId
        },
      }, {
        new: false
      })

      const response = await deleteCloudinaryFile(albumBeforeUpdate.thumbnailCloudinaryId)
      if (!response.result === "ok") {
        return res.status(503).json({
          ok: false,
          msg: response.result
        });
      }

      await fs.unlink(file.path)

      return res.status(201).json({
        ok: true,
        newName: name,
        thumbnail: url
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
  getAlbums,
  getAlbumById,
  deleteAlbum,
  updateAlbum
};
