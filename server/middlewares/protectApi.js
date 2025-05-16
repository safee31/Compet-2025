const asyncControllerHandler = require("../helpers/asyncHandler");
const { customError } = require("../helpers/customError");
const { verifyJwt } = require("../helpers/jwt");

const protectByCookie = asyncControllerHandler(async (req, res, next) => {
  const auth = req.cookies;
  let token;

  if (auth) {
    token = auth.fezzy_session;
  }

  if (!token) {
    return next(
      customError("Authentication failed: Please log in to continue.", 401)
    );
  }

  const { user = null } = await verifyJwt(token);

  if (!user) {
    return next(
      customError(
        "Authentication failed: User session is invalid or expired. Please log in again.",
        401
      )
    );
  }

  if (!user?.role) {
    return next(
      customError(
        "Authentication failed: You don't have the necessary permissions.",
        401
      )
    );
  }

  if (!user?.isVerified) {
    return next(
      customError(
        "Your email is not verified. Please contact support for assistance.",
        400
      )
    );
  }
  // Ensure user user is approved (if applicable)
  if (!user?.isApproved) {
    return next(
      customError("You are not approved yet. Please wait for approval.", 400)
    );
  }
  // Ensure user user is active
  if (!user?.isActive) {
    return next(
      customError(
        "You are inactive. Please contact support for assistance.",
        400
      )
    );
  }

  req.user = user;
  next();
});
module.exports = { protectByCookie };
