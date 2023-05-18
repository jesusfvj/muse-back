const express = require("express");
const { stripePayment, setStripe } = require("../controllers/stripe");
const stripeRouter = express.Router();

stripeRouter.get("/setStripe", setStripe);
stripeRouter.post("/stripePayment", stripePayment);

module.exports = stripeRouter;
