const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
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

// Register body = { fullName, email, password, repPassword, isArtist }
userRouter.post("/register", register);
// Login body = { email, password }
userRouter.post("/login", logInUser);
// FollowUser body = { loggedUserId, followedUserId, isFollowing:Boolean }
userRouter.post("/followUser", followUser);

userRouter.get("/artists/:id", getArtists);

userRouter.get("/artist/:id", getArtistById);

userRouter.get("/followedusers/:id", getFollowedUsers);

userRouter.get("/:id", getUserById);

userRouter.put("/update-username", updateUsername);

userRouter.put("/uploadProfileImage/:userId", upload.any(), updateProfileImage);
// cambiar nombre de usuario
// userRouter.put("/:id", userExists, updateUser);

// userRouter.delete("/delete", deleteUser);

userRouter.post("/playlist/addtrack", addToPlaylist);

userRouter.put("/toggleFollowPlaylist", toggleFollowAlbum);
userRouter.post("/resetpassword", resetPassword);
userRouter.post("/resetpasswordchange", resetPasswordChange);
userRouter.post("/resetpasswordprofile", updatePasswordProfile);

module.exports = userRouter;
