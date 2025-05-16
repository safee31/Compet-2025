const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const User = require("../../models/user");
const { responseHandler } = require("../../helpers/processHandle");
const { setCookie, clearCookie } = require("../../helpers/jwt");
const asyncControllerHandler = require("../../helpers/asyncHandler");

exports.loginAdmin = asyncControllerHandler(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  const user = await User.findOne({ email }).select(
    "email passwordHash isVerified createdAt updatedAt profileImage"
  );

  if (!user) {
    return responseHandler.error(res, "Invalid email or password", 401);
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return responseHandler.error(res, "Invalid email or password", 401);
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "24h",
  });
  setCookie(res, "fezzy_session", token);

  responseHandler.success(res, { user }, "Admin logged in successfully");
});

exports.logoutAdmin = asyncControllerHandler(async (req, res) => {
  clearCookie(res, "fezzy_session");
  responseHandler.success(res, {}, "Admin logged out successfully");
});
