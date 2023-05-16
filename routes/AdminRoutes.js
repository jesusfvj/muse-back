const express = require("express");
const { getUsers,
    getArtists,
    getPlaylists,
    getAlbums,
    getSongs,
    getSearchElement } = require("../controllers/admin");

const adminRouter = express.Router();
adminRouter.get("/getUsers", getUsers);
adminRouter.get("/getArtists", getArtists);
adminRouter.get("/getPlaylists", getPlaylists);
adminRouter.get("/getAlbums", getAlbums);
adminRouter.get("/getSongs", getSongs);
adminRouter.post("/getSearchElement", getSearchElement);

module.exports = adminRouter;