const express = require("express");
const router = express.Router();
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

router.post("/create-payment-intent", async (req, res) => {
  const { countOfCompany, id } = req.body;

  try {
    let paymentIntent;

    if (id) {
      paymentIntent = await stripe.paymentIntents.update(
        id, 
        {
            amount: countOfCompany * 100 * 100,
        }
      );
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        currency: "USD",
        amount: countOfCompany * 100 * 100,
        automatic_payment_methods: { enabled: true },
      });
    }

    // Send publishable key and PaymentIntent details to client
    res.send({
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

router.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

module.exports = router;
