const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");
const playlistRouter = require("./routes/PlaylistRoutes");
const trackRouter = require("./routes/TrackRoutes");
const searchRouter = require("./routes/SearchRoutes");
const queueRouter = require("./routes/PlayQueue");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use("/user", userRouter);
app.use("/playlist", playlistRouter);
app.use("/track", trackRouter);
app.use("/search", searchRouter);
app.use("/queue", queueRouter);

module.exports = app;
