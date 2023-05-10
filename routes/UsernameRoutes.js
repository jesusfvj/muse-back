const express = require('express');
const { compareAndUpdate } = require('../controllers/username');

const usernameRouter = express.Router();

usernameRouter.post('/update-password', compareAndUpdate);


module.exports = usernameRouter;