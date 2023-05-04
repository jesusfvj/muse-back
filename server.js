const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const userRouter = require("./routes/userRoutes");
const uploadSongsRouter = require("./routes/uploadSongsRoutes");
const fileUpload = require("express-fileupload");

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads/'
}));

app.use('/user', userRouter)
app.use('/uploadsongs', uploadSongsRouter)

module.exports = app;
