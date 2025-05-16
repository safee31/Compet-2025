const jwt = require("jsonwebtoken");
const { JWT_SECRET, NODE_ENV } = require("../config");
const User = require("../models/user");

const signJwt = async (payload) => {
  if (!payload || !Object.keys(payload).length || !payload._id) {
    return "";
  }
  return payload.getSigned();
};

const verifyJwt = async (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(payload?.userId).populate("role");

  return {
    user: user?.toAuthJSON(),
  };
};

// Helper to set a cookie
const setCookie = (res, name, value, maxAge = 1000 * 60 * 60 * 24) => {
  const isProduction = NODE_ENV === "production";
  res.cookie(name, value, {
    maxAge: maxAge, // Cookie's lifespan
    httpOnly: true, // Ensures cookie cannot be accessed via JS
    secure: isProduction, // Use secure cookies only in production (HTTPS)
    sameSite: isProduction ? "None" : "Lax", // "None" for cross-site in production, "Lax" for local development
  });
};

// Helper to clear a cookie
const clearCookie = (res, name) => {
  const isProduction = NODE_ENV === "production";
  res.clearCookie(name, {
    httpOnly: true, // Ensures cookie cannot be accessed via JS
    secure: isProduction, // Use secure cookies only in production (HTTPS)
    sameSite: isProduction ? "None" : "Lax", // "None" for cross-site in production, "Lax" for local development
  });
};

module.exports = {
  setCookie,
  clearCookie,
  signJwt,
  verifyJwt,
};
