const PlayQueue = require("../models/PlayQueue");
const User = require("../models/User");

const getQueue = async (req, res) => {
  const { loggedUserId } = req.body;

  try {
    const loggedUserQueue = await PlayQueue.findOne({
      userId: loggedUserId,
    }).populate("tracks");
    if (loggedUserQueue) {
      return res.status(200).json({
        ok: true,
        tracks: loggedUserQueue.tracks,
      });
    }
    const newQueue = new PlayQueue({
      userId: loggedUserId,
    });

    await newQueue.save();
    return res.status(200).json({
      ok: true,
      newQueue,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: error,
    });
  }
};

// const addToQueue = async (req, res) => {
//   const { loggedUserId, trackId } = req.body;
//   try {
//     const logedUserQueue = await PlayQueue.findOne({ userId: loggedUserId });
//     let lastOrder =
//       logedUserQueue.tracks.length > 0
//         ? logedUserQueue.tracks[logedUserQueue.tracks.length - 1].order
//         : 0;
//     const tracks = trackId.map((id, index) => {
//       return { trackId: id, order: lastOrder + index + 1 };
//     });
//     await PlayQueue.updateOne(
//       { userId: loggedUserId },
//       { $push: { tracks: { $each: tracks } } }
//     );
//     const updatedQueue = await PlayQueue.findOne({ userId: loggedUserId });

//     return res.status(200).json({
//       ok: true,
//       playQueue: updatedQueue,
//     });
//   } catch (error) {
//     return res.status(503).json({
//       ok: false,
//       error: error,
//     });
//   }
// };

const removeFromQueue = async (req, res) => {
  const { loggedUserId, trackId } = req.body;
  try {
    const logedUserQueue = await PlayQueue.findOne({ userId: loggedUserId });
    const trackIndex = logedUserQueue.tracks.findIndex(
      (track) => track.trackId.toString() === trackId
    );
    if (trackIndex == -1) {
      return res.status(404).json({
        ok: false,
        msg: "The song is not here",
        trackIndex,
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
      remainingTracks,
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      msg: error,
    });
  }
};

const createQueue = async (req, res) => {
  const { userId, trackId, index } = req.body;

  try {
    const loggedUserQueue = await PlayQueue.findOne({ userId: userId });

    if (loggedUserQueue) {
      const updatedQueue = await PlayQueue.findOneAndUpdate(
        { userId: userId },
        { $set: { tracks: [...trackId] }, index: index },
        { new: true }
      ).populate({ path: "tracks", populate: "artist" });
      return res.status(200).json({
        ok: true,
        playQueue: updatedQueue,
      });
    } else {
      const newQueue = new PlayQueue({
        userId,
        tracks: [...trackId],
        index: index,
      });

      await newQueue.save();

      const user = await User.findOne({ _id: userId });

      user.playerQueue = newQueue._id;
      console.log(user);
      await user.save();

      await newQueue.populate({ path: "tracks", populate: "artist" });

      return res.status(200).json({
        ok: true,
        playQueue: newQueue,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      error: error,
    });
  }
};

const changeIndex = async (req, res) => {
  const { index, userId } = req.body;

  try {
    await PlayQueue.findOneAndUpdate(
      { userId: userId },
      { $set: { index: index } },
      { new: true }
    );

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      error: error,
    });
  }
};

const addToQueue = async (req, res) => {
  const { index, tracksToAdd, userId } = req.body;
  const newTracks = tracksToAdd.flat().map((track) => track._id);

  try {
    const playQueue = await PlayQueue.findOne({ userId: userId });
    playQueue.tracks.splice(index + 1, 0, ...newTracks);

    await playQueue.save();
    await playQueue.populate({ path: "tracks", populate: "artist" });
    return res.status(200).json({
      ok: true,
      playQueue,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      ok: false,
      error: error,
    });
  }
};

module.exports = {
  getQueue,
  addToQueue,
  removeFromQueue,
  createQueue,
  changeIndex,
};
