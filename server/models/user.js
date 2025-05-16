const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { emailRegex } = require("../helpers/strings");

const UserSchema = new Schema(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"],
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      index: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`, // Custom error message
      },
    },
    profileImage: { type: String, default: "" },
    pushToken: { type: String, default: "" },
    introVideo: { type: String, default: "" },
    stripeCustomerId: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: null,
    },
    driverLicense: {
      number: { type: String, default: null },
      state: { type: String, default: null },
      expireDate: { type: Date, default: null },
      photo: { type: String, default: null },
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false, index: true, select: false },
    isActive: { type: Boolean, default: true, index: true },
    isApproved: { type: Boolean, default: false, index: true },
    lastLogin: { type: Date },
    verify_OTP: {
      code: { type: String },
      expires: { type: Date },
    },
    reset_pswd_OTP: {
      code: { type: String },
      expires: { type: Date },
    },
    reset_pswd_session: {
      session: { type: String },
      expires: { type: Date },
    },
  },
  { timestamps: true }
);

// ✅ Ensure virtual fields are included when converting to JSON
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });
// Password Hashing Before Saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(11);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare Password
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

UserSchema.methods.setPassword = function () {
  const salt = bcrypt.genSaltSync(11);
  this.passwordHash = bcrypt.hashSync(this.passwordHash, salt);
};

// Generate JWT Token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ userId: this._id }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    phone: this.phone,
    profileImage: this.profileImage,
    introVideo: this.introVideo,
    isVerified: this.isVerified,
    isApproved: this.isApproved,
    isActive: this.isActive,
    role: this.role,
    driverLicense: this.driverLicense,
    stripeCustomerId: this.stripeCustomerId,
  };
};

UserSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    isVerified: this.isVerified,
    profileImage: this.profileImage,
    introVideo: this.introVideo,
    fullName: this.fullName,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    driverLicense: this.driverLicense,
  };
};

module.exports = mongoose.model("User", UserSchema);
