const mongoose = require("mongoose");

const ticketPaymentSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    sequence: {
      type: Number,
      required: true,
      min: 1, // Payment number (1, 2, 3, 4...)
    },
    paymentMethod: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PaymentCard",
    },

    invoiceId: { type: String, default: "" },
    transactionId: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Confirmed", "Failed"],
      default: "Pending",
    },
    autoChargeStatus: {
      type: String,
      enum: ["Success", "Failed", "No Payment Method"],
      default: "Success",
    },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date }, // When this payment was made
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TicketPayment =
  mongoose.models.TicketPayment ||
  mongoose.model("TicketPayment", ticketPaymentSchema);

module.exports = TicketPayment;
