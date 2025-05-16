const express = require("express");
const {
  registerUser,
  loginUser,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
  readUser,
  logout,
  verifyUserOTP,
  sendUserOTP,
  confirmChangePassword,
  changePasswordRequest,
} = require("../../controllers/User/auth");
const { protectByCookie } = require("../../middlewares/protectApi");
const { isUser } = require("../../middlewares/validateRoles");

const router = express.Router();

// Register User (step 1: register with email, password, department)
router.post("/signup", registerUser);

// User login (step 2: after registration, employee logs in)
router.post("/login", loginUser);

// Verify User email (OTP verification)
router.post("/verify-email", verifyUserEmail);

// Forgot password (step 3: employee forgets password and requests OTP)
router.post("/forgot-password", forgotPassword);
router.post("/send-otp", sendUserOTP);
router.post("/verify-otp", verifyUserOTP);
// Reset password (step 4: employee verifies OTP and resets password)
router.post("/reset-password", resetPassword);

router.get("/", protectByCookie, isUser, readUser);
router.post("/logout", protectByCookie, isUser, logout);

router.post("/change-password", protectByCookie, isUser, changePasswordRequest);
router.post(
  "/confirm-change-password",
  protectByCookie,
  isUser,
  confirmChangePassword
);

module.exports = router;
