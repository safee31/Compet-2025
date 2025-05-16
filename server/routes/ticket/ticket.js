const express = require("express");
const { protectByCookie } = require("../../middlewares/protectApi"); // Auth middleware
const { isAdminORUser } = require("../../middlewares/validateRoles"); // Role validation middleware
const {
  createTicket,
  getUserTickets,
} = require("../../controllers/Ticket/ticket");
const {
  createTicketPayment,
} = require("../../controllers/Ticket/ticketPayment");
const { uploadImage } = require("../../middlewares/multer");

const router = express.Router();

// Route to create a new ticket and its associated payments
router.get("/", protectByCookie, isAdminORUser, getUserTickets);
router.post("/", protectByCookie, isAdminORUser, uploadImage, createTicket);

// Route to create payment installments for a ticket
router.post("/payment", protectByCookie, isAdminORUser, createTicketPayment);

module.exports = router;
