const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");
const uploadSongsRouter = require("./routes/uploadSongsRoutes");
const playlistRouter = require("./routes/PlaylistRoutes");
const trackRouter = require("./routes/TrackRoutes");
const multer = require('multer');
const searchRouter = require("./routes/SearchRoutes");
const searchRouter = require("./routes/SearchRoutes");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

/* const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  }); */

const upload = multer({ dest: './uploads' });

app.use("/user", userRouter);
app.use("/playlist", playlistRouter);
app.use("/track", trackRouter);
app.use("/search", searchRouter);
app.use("/uploadsongs", upload.any(), uploadSongsRouter)

module.exports = app;
