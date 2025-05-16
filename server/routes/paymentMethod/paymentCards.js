const express = require("express");
const { protectByCookie } = require("../../middlewares/protectApi");
const { isAdminORUser } = require("../../middlewares/validateRoles");
const {
  addPaymentCard,
  getUserCards,
  updateDefaultCard,
  deletePaymentCard,
} = require("../../controllers/PaymentMethods/paymentCard");

const router = express.Router();

// Route to add a new payment card
router.post("/", protectByCookie, isAdminORUser, addPaymentCard);

// Route to fetch all payment cards for the authenticated user
router.get("/", protectByCookie, isAdminORUser, getUserCards);

// Route to update the default payment card
router.put("/default", protectByCookie, isAdminORUser, updateDefaultCard);

// Route to delete a payment card
router.delete(
  "/:paymentCardId",
  protectByCookie,
  isAdminORUser,
  deletePaymentCard
);

module.exports = router;
