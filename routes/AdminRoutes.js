const express = require("express");
const { getUsers } = require("../controllers/admin");

const adminRouter = express.Router();
adminRouter.get("/getUsers", getUsers);

module.exports = adminRouter;
