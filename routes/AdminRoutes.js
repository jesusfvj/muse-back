const express = require("express");
const {
    getSearchElement,
    toggleBanAsset,
    getCollection
} = require("../controllers/admin");
const checkJWT = require("../middlewares/checkJWT");

const adminRouter = express.Router();
adminRouter.post("/getSearchElement", checkJWT, getSearchElement);
adminRouter.post("/getCollection", checkJWT, getCollection);
adminRouter.post("/toggleBanAsset", checkJWT, toggleBanAsset);
module.exports = adminRouter;