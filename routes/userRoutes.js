const express = require("express");
const userRouter = express.Router();
const { register, logInUser, followUser } = require("../controllers/user");

// Register body = { fullName, email, password, repPassword, isArtist }
userRouter.post("/register", register);
// Login body = { email, password }
userRouter.post("/login", logInUser);
// FollowUser body = { loggedUserId, followedUserId, isFollowing:Boolean }
userRouter.post("/followUser", followUser);


// userRouter.delete("/delete", deleteUser);

module.exports = userRouter;
