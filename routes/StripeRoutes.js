const express = require("express");
const { stripePayment, setStripe } = require("../controllers/stripe");
const checkJWT = require("../middlewares/checkJWT");
const stripeRouter = express.Router();
const stripe = require("stripe")('pk_test_51N80saK8GYiDB5U2dA7gHIgSiGYxbueVVFSsP5W0c4mTIyr2oPqUiYpeW46ijdYrC4MWUNFIIDKAP06hC9IAsY0400tBSO8Ghc');

stripeRouter.get("/setStripe", checkJWT, setStripe);
stripeRouter.post("/stripePayment", checkJWT, stripePayment);

module.exports = stripeRouter; 