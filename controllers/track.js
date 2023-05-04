const Track = require('../models/Track')

const addTracks = async (req, res) => {
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

module.exports = { addTracks }