const express = require('express');
const { compareAndUpdate } = require('../controllers/username');
const checkJWT = require("../middlewares/checkJWT");

const usernameRouter = express.Router();

usernameRouter.post('/update-password', checkJWT, compareAndUpdate);


module.exports = usernameRouter;