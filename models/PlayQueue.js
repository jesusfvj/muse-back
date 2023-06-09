const mongoose = require("mongoose");

const playQueueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tracks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Track",
    required: true,
  },
  index: {
    type: Number,
    required: true,
    default: 0,
  },
});

const PlayQueue = mongoose.model("Play Queue", playQueueSchema);

module.exports = PlayQueue;
