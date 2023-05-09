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
            userId: loggedUserId,
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
    const { loggedUserId, trackId } = req.body;
    try {
      const logedUserQueue = await PlayQueue.findOne({ userId: loggedUserId });
      let lastOrder = logedUserQueue.tracks.length > 0 ? logedUserQueue.tracks[logedUserQueue.tracks.length - 1].order : 0;
      const tracks = trackId.map((id, index) => {
        return { trackId: id, order: lastOrder + index + 1 };
      });
      await PlayQueue.updateOne({ userId: loggedUserId }, { $push: { tracks: { $each: tracks } } });
      const updatedQueue = await PlayQueue.findOne({ userId: loggedUserId });
  
      return res.status(200).json({
        ok: true,
        playQueue: updatedQueue,
      });
    } catch (error) {
      return res.status(503).json({
        ok: false,
        error: error,
      });
    }
  };

const removeFromQueue = async (req, res) => {
    const { loggedUserId, trackId } = req.body;
    try {
        const logedUserQueue = await PlayQueue.findOne({ userId: loggedUserId });
        const trackIndex = logedUserQueue.tracks.findIndex(track => track.trackId.toString() === trackId);
        if (trackIndex == -1) {
            return res.status(404).json({
                ok: false,
                msg: "The song is not here",
                trackIndex
            });
        }
        logedUserQueue.tracks.splice(trackIndex, 1);
        const remainingTracks = logedUserQueue.tracks.slice(trackIndex);
        for (let i = 0; i < remainingTracks.length; i++) {
            remainingTracks[i].order = trackIndex + 1 + i;
        }
        await logedUserQueue.save();
        return res.status(200).json({
            ok: true,
            playQueue: logedUserQueue,
            remainingTracks
        });
    } catch (error) {
        return res.status(503).json({
            ok: false,
            msg: error,
        });
    }
};




module.exports = { getQueue, addToQueue, removeFromQueue }