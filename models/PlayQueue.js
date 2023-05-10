const mongoose = require("mongoose");

const playQueueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  tracks: [{
    trackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }]
});

const PlayQueue = mongoose.model("Play Queue", playQueueSchema);

module.exports = PlayQueue;
