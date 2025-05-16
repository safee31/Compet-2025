const express = require("express");
const { protectByCookie } = require("../../middlewares/protectApi"); // Auth middleware
const { isAdminORUser } = require("../../middlewares/validateRoles"); // Role validation middleware

const {
  createTicketPayment,
  getUserPayments,
  getPaymentSummary,
} = require("../../controllers/Ticket/ticketPayment");

const router = express.Router();

// Route to create payment installments for a ticket
router.post("/", protectByCookie, isAdminORUser, createTicketPayment);
router.get("/", protectByCookie, isAdminORUser, getUserPayments);
router.get("/summary", protectByCookie, isAdminORUser, getPaymentSummary);

module.exports = router;
