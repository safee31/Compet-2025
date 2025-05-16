const { customError } = require("../helpers/customError");

exports.appErrorHandler = async (err, req, res, next) => {
  console.error(err)
  let error = { ...err };
  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;

  // Handle duplicate key errors (MongoDB unique index violations)
  if (err.code === 11000) {
    error = customError(
      `Duplicate ${Object.keys(
        err.keyValue
      )} field. Please use a unique value.`,
      400
    );
  }

  // Handle expired JWT token errors
  if (err.name === "TokenExpiredError") {
    error = customError("Session Expired. Please log in again.", 401);
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const msgs = Object.values(err.errors).map((v) => v.message);
    error = customError(msgs, 400);
  }

  // Handle incorrect API URL errors
  if (err.code === "ENOTFOUND") {
    error = customError(
      "Invalid API URL. Please check the URL and try again.",
      400
    );
  }

  // Handle server closures
  if (err.code === "ECONNREFUSED") {
    error = customError(
      "The server is currently unavailable. Please try again later.",
      503
    );
  }

  // Handle no internet connection
  if (err.code === "ENETUNREACH") {
    error = customError(
      "No internet connection. Please check your network and try again.",
      503
    );
  }
  console.error(
    "❌ Incoming Error =>",
    error.message || error?.response?.data || err
  );
  return res.status(error.statusCode).json({
    success: false,
    ...(Array.isArray(error?.message)
      ? { message: String(error.message) }
      : { message: String(error.message) }),
  });
};
