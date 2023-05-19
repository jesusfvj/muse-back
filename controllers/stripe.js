const stripe = require("stripe")('sk_test_51N80saK8GYiDB5U24ZmQuHih0a9IYPAaMZ24VvoSeISUqqtbbgZpU7TllNMvQTFF7C0jb3RVjENN6EbY3BMgY6m700Uv4cjaBQ');

const stripePayment = async (req, res) => {
    const {
        items
    } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 200,
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
}
const setStripe = async (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
}

module.exports = {
    stripePayment,
    setStripe
};