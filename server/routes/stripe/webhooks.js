const express = require("express");
const { handleStripeWebhook } = require("../../controllers/Stripe/webhooks");

const router = express.Router();

// Stripe requires the raw body for signature verification
router.post(
  "/handle",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
