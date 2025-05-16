const express = require("express");
const router = express.Router();

// Authentication routes
router.use("/user/auth", require("./user/auth"));
router.use("/user/", require("./user/user"));
router.use("/admin/auth", require("./admin/auth"));
router.use("/admin/", require("./admin/admin"));

router.use("/ticket/", require("./ticket/ticket"));
router.use("/ticket/payment/", require("./ticket/ticketPayment"));

router.use("/payment-method/card", require("./paymentMethod/paymentCards"));
router.use("/stripe/payment/", require("./stripe/payment"));

// Employe and Files routes routes
router.use("/files/", require("./files/files"));

module.exports = router;
