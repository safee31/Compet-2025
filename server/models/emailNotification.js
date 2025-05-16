const mongoose = require("mongoose");

const emailNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    type: {
      type: String,
      enum: ["meeting", "survey", "newsletter"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "pending", "failed"],
      default: "sent",
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailNotification", emailNotificationSchema);
