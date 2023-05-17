const express = require("express");
const {
  getQueue,
  addToQueue,
  removeFromQueue,
  createQueue,
  changeIndex,
} = require("../controllers/playQueue");
const queueRouter = express.Router();

queueRouter.get("/getQueue", getQueue);
queueRouter.put("/addToQueue", addToQueue);
queueRouter.post("/createQueue", createQueue);
queueRouter.post("/removeFromQueue", removeFromQueue);
queueRouter.post("/index", changeIndex);

module.exports = queueRouter;
