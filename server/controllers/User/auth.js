const asyncControllerHandler = require("./../../helpers/asyncHandler");
const User = require("../../models/user");

const { responseHandler } = require("../../helpers/processHandle");
const {
  sendVerificationOTP,
  sendResetPasswordOTP,
} = require("../../services/emailSender");
const Role = require("../../models/role");
const { generateOTPCode } = require("../../helpers/OTP");
const { setCookie, clearCookie } = require("../../helpers/jwt");
const { getDocID } = require("../../helpers/strings");

const registerUser = asyncControllerHandler(async (req, res, next) => {
  const { email, password, fullName, phone } = req.body;

  // Check if email already exists
  if (await User.exists({ email })) {
    return responseHandler.error(
      res,
      "User already exists with this email!",
      400
    );
  }

  // Create the User
  const user = new User({
    email,
    passwordHash: password,
    fullName,
    phone,
  });

  // Assign default Role (User with type 2)
  let userRole = await Role.findOne({ name: "User", type: 2 });

  if (!userRole) {
    userRole = await Role.create({ name: "User", type: 2 });
  }

  user.role = userRole._id;

  // Generate OTP and send to email for verification
  const otpCode = await generateOTPCode();
  await sendVerificationOTP(email, otpCode);

  // Save OTP in User schema
  user.verify_OTP = { code: otpCode, expires: Date.now() + 3600000 }; // OTP expires in 1 hour
  await user.save();

  return responseHandler.success(res, "User registered successfully!", 201);
});

const verifyUserEmail = asyncControllerHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return responseHandler.error(res, "User not found!", 404);
  }
  if (user?.isVerified && !user?.verify_OTP) {
    return responseHandler.error(res, "User is already verified!", 404);
  }

  if (user.verify_OTP.code !== otp || Date.now() > user.verify_OTP.expires) {
    return responseHandler.error(res, "Invalid or expired OTP", 400);
  }

  user.isApproved = true;
  user.isVerified = true;
  user.verify_OTP = null;
  user.isActive = true;
  await user.save();

  return responseHandler.success(res, null, "Email verified successfully!");
});

const loginUser = asyncControllerHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .populate("role", "name type")
    .select("+passwordHash");
  if (!user || !(await user.matchPassword(password))) {
    return responseHandler.unauthorized(res, "Incorrect email or password!");
  }

  // Ensure user is verified
  if (!user?.isVerified) {
    return responseHandler.error(
      res,
      "Your email is not verified. Please contact support for assistance.",
      400
    );
  }

  // Ensure user user is approved (if applicable)
  if (!user?.isApproved) {
    return responseHandler.error(
      res,
      "Your user is not approved yet. Please wait for approval.",
      400
    );
  }
  if (!user.isActive) {
    return responseHandler.error(
      res,
      "Your user is inactive. Please contact support for assistance.",
      400
    );
  }
  const role = user?.role;

  // Determine flags
  const isAuth = [1, 2].includes(role?.type);

  // Generate JWT token
  const token = user.getSignedToken();

  // Use utility to set the cookie
  setCookie(res, "fezzy_session", token);

  return responseHandler.success(
    res,
    {
      user: user?.toAuthJSON(),
      isAuth,
    },
    "Login successful!"
  );
});
const forgotPassword = asyncControllerHandler(async (req, res, next) => {
  const { email } = req.body;

  // Check if the email exists in the system
  const user = await User.findOne({ email });
  if (!user) {
    return responseHandler.error(res, "User not found!", 404);
  }

  // Generate OTP and send it to the user's email for password reset
  const otpCode = await generateOTPCode();
  await sendResetPasswordOTP(email, otpCode); // Send OTP via email service
  const expiresIn = Date.now() + 3600000;
  // Save the OTP in User schema
  user.reset_pswd_OTP = { code: otpCode, expires: expiresIn }; // OTP expires in 1 hour

  // Generate a reset session for password reset
  const fezzy_reset_pswd_session =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Save the reset session in the user session
  user.reset_pswd_session = {
    session: fezzy_reset_pswd_session,
    expires: expiresIn, // 1 hour
  };

  await user.save();

  clearCookie(res, "fezzy_session");
  setCookie(
    res,
    "fezzy_reset_pswd_session",
    fezzy_reset_pswd_session,
    expiresIn
  );

  return responseHandler.success(
    res,
    { expiresIn },
    "OTP sent to email for password reset."
  );
});

const resetPassword = asyncControllerHandler(async (req, res, next) => {
  const { email = "", otp = "", newPassword = "" } = req.body;
  // Validate reset session (check if reset session cookie exists and is valid)
  const fezzy_reset_pswd_session = req?.cookies?.fezzy_reset_pswd_session;
  if (!fezzy_reset_pswd_session) {
    return responseHandler.error(res, "Invalid reset session", 400);
  }

  if (!email?.trim()) {
    return responseHandler.error(res, "Email is required", 400);
  }

  if (!newPassword?.trim()) {
    return responseHandler.error(res, "New password is required", 400);
  }

  // if (!otp?.trim()) {
  //   return responseHandler.error(res, "OTP is required", 400);
  // }

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    return responseHandler.error(res, "User not found!", 404);
  }

  if (fezzy_reset_pswd_session !== user.reset_pswd_session?.session) {
    return responseHandler.error(res, "Invalid or expired reset session", 400);
  }
  if (Date.now() > user?.reset_pswd_session?.expires) {
    return responseHandler.error(res, "Reset session has expired", 400);
  }
  // // Validate OTP
  // if (
  //   user.reset_pswd_OTP.code !== otp ||
  //   Date.now() > user.reset_pswd_OTP.expires
  // ) {
  //   return responseHandler.error(res, "Invalid or expired OTP", 400);
  // }

  // Update the password after OTP verification
  user.passwordHash = newPassword;
  // user.reset_pswd_OTP = null;
  user.reset_pswd_session = null;
  await user.save();

  clearCookie(res, "fezzy_reset_pswd_session");
  clearCookie(res, "fezzy_session");

  return responseHandler.success(res, null, "Password reset successfully!");
});

const readUser = asyncControllerHandler(async (req, res) => {
  // Ensure user is authenticated
  const user = req?.user;
  const role = user?.role;

  // Determine flags
  const isAuth = [1, 2].includes(role?.type);

  // Return the combined response with essential data and flags
  return responseHandler.success(
    res,
    {
      user: req?.user,
      isAuth,
    },
    "User authenticated successfully!"
  );
});
const logout = asyncControllerHandler(async (req, res) => {
  // Clear the authentication and reset session cookies
  clearCookie(res, "fezzy_reset_pswd_session");
  clearCookie(res, "fezzy_session");

  return responseHandler.success(res, null, "Logged out successfully!");
});

const verifyUserOTP = asyncControllerHandler(async (req, res, next) => {
  const { email, otp, otpType } = req.body;
  if (!email || !otp || !otpType) {
    return responseHandler.error(
      res,
      "Email, OTP, and OTP type are required!",
      400
    );
  }

  const user = await User.findOne({ email });
  if (!user) return responseHandler.error(res, "User not found!", 404);

  let storedOTP;
  if (otpType === "verify") {
    storedOTP = user.verify_OTP;
  } else if (otpType === "reset") {
    storedOTP = user.reset_pswd_OTP;
  } else {
    return responseHandler.error(res, "Invalid OTP type!", 400);
  }

  if (!storedOTP || storedOTP.code !== otp || Date.now() > storedOTP.expires) {
    return responseHandler.error(res, "Invalid or expired OTP!", 400);
  }

  if (otpType === "verify") {
    user.isVerified = true;
    user.verify_OTP = null;
  } else if (otpType === "reset") {
    // Allow reset session to persist, only remove OTP
    // user.reset_pswd_OTP = null;
    if (!user?.reset_pswd_session) {
      return responseHandler.error(
        res,
        "Invalid or expired reset session!",
        400
      );
    }
    user.reset_pswd_OTP = null;
  }

  await user.save();
  return responseHandler.success(res, "OTP verified successfully!");
});
const sendUserOTP = asyncControllerHandler(async (req, res, next) => {
  const { email, otpType } = req.body;
  if (!email || !otpType)
    return responseHandler.error(res, "Email and OTP type are required!", 400);
  if (!["verify", "reset"].includes(otpType)) {
    return responseHandler.error(res, "Invalid OTP type!", 400);
  }

  const user = await User.findOne({ email });
  if (!user) return responseHandler.error(res, "User not found!", 404);

  let expiresIn = "";

  const otpCode = await generateOTPCode();

  if (otpType === "verify") {
    await sendVerificationOTP(email, otpCode);
    expiresIn = Date.now() + 3600000;
    user.verify_OTP = { code: otpCode, expires: expiresIn }; // 1-hour expiry
  } else if (otpType === "reset") {
    await sendResetPasswordOTP(email, otpCode);
    expiresIn = Date.now() + 3600000;
    user.reset_pswd_OTP = { code: otpCode, expires: expiresIn }; // 1-hour expiry

    const fezzy_reset_pswd_session =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    user.reset_pswd_session = {
      session: fezzy_reset_pswd_session,
      expires: expiresIn,
    }; // 1 hour expiry

    clearCookie(res, "fezzy_session");
    setCookie(
      res,
      "fezzy_reset_pswd_session",
      fezzy_reset_pswd_session,
      expiresIn
    );
  }

  await user.save();
  return responseHandler.success(res, "OTP sent to email.");
});

const changePasswordRequest = asyncControllerHandler(async (req, res, next) => {
  const { oldPassword } = req.body;
  const userId = getDocID(req.user);

  // Get the user with password hash
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    return responseHandler.error(res, "User not found!", 404);
  }

  // Verify old password
  if (!(await user.matchPassword(oldPassword))) {
    return responseHandler.error(res, "Current password is incorrect!", 400);
  }

  // Generate OTP and send it to the user's email for password change
  const otpCode = await generateOTPCode();
  await sendResetPasswordOTP(user.email, otpCode); // Reusing reset password email service
  const expiresIn = Date.now() + 3600000; // 1 hour expiry

  // Save the OTP in User schema
  user.reset_pswd_OTP = { code: otpCode, expires: expiresIn };

  // Generate a change password session
  const fezzy_change_pswd_session =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  // Save the change password session in the user record
  user.reset_pswd_session = {
    session: fezzy_change_pswd_session,
    expires: expiresIn,
  };

  await user.save();

  // Set a cookie for the change password session
  setCookie(
    res,
    "fezzy_change_pswd_session",
    fezzy_change_pswd_session,
    expiresIn
  );

  return responseHandler.success(
    res,
    { expiresIn },
    "OTP sent to email for password change."
  );
});

const confirmChangePassword = asyncControllerHandler(async (req, res, next) => {
  const { otp, newPassword } = req.body;
  const userId = getDocID(req.user);

  // Validate change password session
  const fezzy_change_pswd_session = req?.cookies?.fezzy_change_pswd_session;
  if (!fezzy_change_pswd_session) {
    return responseHandler.error(res, "Invalid change password session", 400);
  }

  if (!newPassword?.trim()) {
    return responseHandler.error(res, "New password is required", 400);
  }

  // if (!otp?.trim()) {
  //   return responseHandler.error(res, "OTP is required", 400);
  // }

  // Get the user with password hash
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) {
    return responseHandler.error(res, "User not found!", 404);
  }

  // Validate session
  if (fezzy_change_pswd_session !== user.reset_pswd_session?.session) {
    return responseHandler.error(res, "Invalid session", 400);
  }
  if (Date.now() > user?.reset_pswd_session?.expires) {
    return responseHandler.error(res, "Session has expired", 400);
  }

  // // Validate OTP
  // if (
  //   user.reset_pswd_OTP.code !== otp ||
  //   Date.now() > user.reset_pswd_OTP.expires
  // ) {
  //   return responseHandler.error(res, "Invalid or expired OTP", 400);
  // }

  // Update the password after OTP verification
  user.passwordHash = newPassword;
  // user.reset_pswd_OTP = null;
  user.reset_pswd_session = null;
  await user.save();

  // Clear the change password session cookie
  clearCookie(res, "fezzy_change_pswd_session");

  return responseHandler.success(res, null, "Password changed successfully!");
});

module.exports = {
  registerUser,
  verifyUserEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  readUser,
  logout,
  verifyUserOTP,
  sendUserOTP,
  changePasswordRequest,
  confirmChangePassword,
};
