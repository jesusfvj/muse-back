const express = require("express");
const { getQueue, addToQueue, removeFromQueue } = require("../controllers/playQueue");
const queueRouter = express.Router();

queueRouter.get("/getQueue", getQueue);
queueRouter.put("/addToQueue", addToQueue);
queueRouter.post("/removeFromQueue", removeFromQueue);

module.exports = queueRouter;
