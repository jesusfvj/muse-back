const Track = require('../models/Track')
const {
    uploadImage,
    uploadSong,
    deleteImage
} = require("../utils/cloudinary");
const {
    grouperDataFunction
} = require('../utils/groupData');
const fs = require('fs-extra');


const addTracks = async (req, res) => {
    const {
        loggedUserId,
        trackId,
        isAdded
    } = req.body
    try {
        const loggedUser = await User.findOne({
            _id: loggedUserId
        });
        if (isAdded) {
            await loggedUser.updateOne({
                $addToSet: {
                    tracks: {
                        $each: trackId
                    }
                }
            });
            return res.status(200).json({
                ok: true,
                loggedUserId,
                trackId,
                isAdded
            });
        } else {
            await loggedUser.updateOne({
                $pull: {
                    tracks: {
                        $in: trackId
                    }
                }
            });
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

const uploadNewSongs = async (req, res) => {
    try {
        const dataFiles = req.body
        const userId = req.params.userId
        if (req.files) {
            const filteredFiles = grouperDataFunction(req.files)
            console.log(filteredFiles)
            filteredFiles.map(async ({ audio, image }, index) => {
                const { songTitle, genre, albumName } = JSON.parse(dataFiles[`dataFile${index+1}`])
                const newTrack = new Track({
                    name: songTitle,
                    genre: genre,
                    artist: userId,
                    album: albumName ? albumName : null
                })
                const resultImage = await uploadImage(image.path)
                newTrack.thumbnailUrl = resultImage.secure_url
                newTrack.thumbnailCloudinaryId = resultImage.public_id

                const resultSong = await uploadSong(audio.path)
                newTrack.trackUrl = resultSong.secure_url
                newTrack.trackCloudinaryId = resultSong.public_id

                await fs.unlink(image.path)
                await fs.unlink(audio.path)

                await newTrack.save();
            })
        }

        return res.status(200).json({
            ok: true
        });

    } catch (error) {
        return res.status(503).json({
            ok: false,
            msg: "Something happened...",
        });
    }
};

module.exports = {
    addTracks,
    uploadNewSongs
}