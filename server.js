const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");
const playlistRouter = require("./routes/PlaylistRoutes");
const trackRouter = require("./routes/TrackRoutes");
const searchRouter = require("./routes/SearchRoutes");
const queueRouter = require("./routes/PlayQueue");
const albumRouter = require("./routes/AlbumRoutes");
const adminRouter = require("./routes/AdminRoutes");
const StripeRouter = require("./routes/StripeRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/user", userRouter);
app.use("/playlist", playlistRouter);
app.use("/track", trackRouter);
app.use("/search", searchRouter);
app.use("/queue", queueRouter);
app.use("/album", albumRouter);
app.use("/admin", adminRouter);
app.use("/stripe", StripeRouter);

module.exports = app;