const express = require("express");
const {
    getSearchElement,
    toggleBanAsset,
    getCollection } = require("../controllers/admin");

const adminRouter = express.Router();
adminRouter.post("/getSearchElement", getSearchElement);
adminRouter.post("/getCollection", getCollection);
adminRouter.post("/toggleBanAsset", toggleBanAsset);
module.exports = adminRouter;