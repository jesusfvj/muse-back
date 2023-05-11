const Album = require("../models/Album");
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

module.exports = {
  getAlbums,
  getAlbumById,
};
