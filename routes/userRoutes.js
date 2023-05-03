const express = require("express");
const userRouter = express.Router();
const { register } = require("../controllers/user");

userRouter.post("/register", register);
// userRouter.post("/login", logInUser);
// userRouter.delete("/delete", deleteUser);

module.exports = userRouter;
