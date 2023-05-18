const express = require("express");
const {
  getQueue,
  addToQueue,
  removeFromQueue,
  createQueue,
  changeIndex,
} = require("../controllers/playQueue");
const queueRouter = express.Router();
const checkJWT = require("../middlewares/checkJWT");

queueRouter.get("/getQueue", checkJWT, getQueue);
queueRouter.post("/createQueue", checkJWT, createQueue);
queueRouter.post("/removeFromQueue", checkJWT, removeFromQueue);
queueRouter.post("/index", checkJWT, changeIndex);
queueRouter.post("/addToQueue", checkJWT, addToQueue);

module.exports = queueRouter;
