// routes/paymentRoutes.js
const express = require("express");
const {
  createSubscriptionWithInstallments,
  changeSubscriptionPaymentMethod,
} = require("../../controllers/Stripe/payment");
const { isAdminORUser } = require("../../middlewares/validateRoles");
const { protectByCookie } = require("../../middlewares/protectApi");
const router = express.Router();

router.post(
  "/subscribe-installments",
  protectByCookie,
  isAdminORUser,
  createSubscriptionWithInstallments
);
router.put(
  "/subscription-payment-method",
  protectByCookie,
  isAdminORUser,
  changeSubscriptionPaymentMethod
);

module.exports = router;
