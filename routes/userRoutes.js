const express = require("express");
const userRouter = express.Router();
const {
  register,
  logInUser,
  followUser,
  getUserById,
  getArtists,
  updateUsername,
  getFollowedUsers,
  getArtistById,
  addToPlaylist,
} = require("../controllers/user");

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
// cambiar nombre de usuario
// userRouter.put("/:id", userExists, updateUser);

// userRouter.delete("/delete", deleteUser);

userRouter.post("/playlist/addtrack", addToPlaylist);

module.exports = userRouter;
