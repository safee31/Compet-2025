const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      trim: true,
      index: true,
      default: "",
    },
    ticketNumber: { type: String, required: true, trim: true, index: true },
    ticketType: {
      type: String,
      required: true,
      enum: ["Speeding", "Right-of-way", "Parking", "Other"],
      trim: true,
    },
    location: { type: String, required: true, trim: true },
    policeAgency: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    ticketPhoto: { type: String, default: "" },
    interest: { type: Number, default: 0, min: 0 },
    amountWithInterest: { type: Number, default: 0, min: 0 },
    installmentsCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 8,
    },
    installmentsLabel: {
      type: String,
      // required: true,
      enum: [
        "Pay in Full",
        "Pay in 2",
        "Pay in 3",
        "Pay in 4",
        "Pay in 5",
        "Pay in 6",
        "Pay in 7",
        "Pay in 8",
      ],
      trim: true,
    },
    billingPeriod: {
      type: String,
      required: true,
      // enum: ["Every 2 Days", "Every Week", "Every Month"], // Enum for billing period
      trim: true,
    },
    isPaid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["open", "closed", "pending"],
      default: "open",
    },
    isCompleted: { type: Boolean, default: false },
    paymentMethod: {
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentCard",
      },
      // bank: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: "BankAccount",
      // },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to calculate `amountWithInterest` and synchronize `installmentsLabel`
ticketSchema.pre("save", function (next) {
  // Dynamically calculate `amountWithInterest`
  // if (this.interest && this.price) {
  //   this.amountWithInterest = this.price + (this.price * this.interest) / 100;
  // }

  // Dynamically set `installmentsLabel` based on `installmentsCount`

  const installmentsLabels = {
    1: "Pay in Full",
    2: "Pay in 2",
    3: "Pay in 3",
    4: "Pay in 4",
    5: "Pay in 5",
    6: "Pay in 6",
    7: "Pay in 7",
    8: "Pay in 8",
  };
  this.installmentsLabel = installmentsLabels[parseInt(this.installmentsCount)];

  next();
});

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
