const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const checkJWT = require("../middlewares/checkJWT");
const {
  register,
  logInUser,
  followUser,
  getUserById,
  getArtists,
  updateUsername,
  getFollowedUsers,
  getArtistById,
  updateProfileImage,
  addToPlaylist,
  toggleFollowAlbum,
  resetPassword,
  resetPasswordChange,
  updatePasswordProfile,
} = require("../controllers/user");

const upload = multer({ dest: "./uploads" });

userRouter.post("/register", register);
userRouter.post("/login", logInUser);
userRouter.post("/followUser", checkJWT, followUser);
userRouter.get("/artists/:id", checkJWT, getArtists);
userRouter.get("/artist/:id", checkJWT, getArtistById);
userRouter.get("/followedusers/:id", checkJWT, getFollowedUsers);
userRouter.get("/:id", checkJWT, getUserById);
userRouter.put("/update-username", checkJWT, updateUsername);
userRouter.put("/uploadProfileImage/:userId", checkJWT, upload.any(), updateProfileImage);
userRouter.post("/playlist/addtrack", checkJWT, addToPlaylist);
userRouter.put("/toggleFollowPlaylist", checkJWT, toggleFollowAlbum);
userRouter.post("/resetpassword", checkJWT, resetPassword);
userRouter.post("/resetpasswordchange", checkJWT, resetPasswordChange);
userRouter.post("/resetpasswordprofile", checkJWT, updatePasswordProfile);

module.exports = userRouter;