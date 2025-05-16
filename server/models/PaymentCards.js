const mongoose = require("mongoose");

const userPaymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stripePaymentMethodId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    last4: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      enum: ["visa", "mastercard", "amex", "discover", "other"],
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    exp_month: {
      type: Number,
      min: 1,
      max: 12,
    },
    exp_year: {
      type: Number,
    },
    fingerprint: {
      type: String,
      trim: true,
      required: true,
    },
    country: {
      type: String,
      default: "US",
    },
  },
  { timestamps: true, versionKey: false }
);

// Ensure only 1 default card per user
userPaymentMethodSchema.index(
  { user: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } }
);
userPaymentMethodSchema.index({ user: 1, fingerprint: 1 }, { unique: true });

module.exports = mongoose.model("PaymentCard", userPaymentMethodSchema);
