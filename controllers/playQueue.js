const PlayQueue = require('../models/PlayQueue')

const getQueue = async (req, res) => {
    const { loggedUserId } = req.body
    try {
        const logedUserQueue = await PlayQueue.findOne({ userId: loggedUserId });
        if (logedUserQueue) {
            return res.status(200).json({
                ok: true,
                tracks: logedUserQueue.tracks
            });
        }
        const newQueue = new PlayQueue({
            loggedUserId,
        });

        await newQueue.save();
        return res.status(200).json({
            ok: true,
            newQueue
        });
    } catch (error) {
        return res.status(503).json({
            ok: false,
            msg: error,
        });
    }
}

const addToQueue = async (req, res) => {
    const { loggedUserId, trackId } = req.body
    try {
        const logedUserQueue = await PlayQueue.findOne({ userId: loggedUserId });
        await logedUserQueue.updateOne({ $push: { tracks: trackId } });
    } catch (error) {
        return res.status(503).json({
            ok: false,
            msg: error,
        });
    }
}