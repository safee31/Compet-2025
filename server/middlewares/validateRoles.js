const { customError } = require("../helpers/customError");

// Check if the user has the 'Employee' role
const isUser = async (req, res, next) => {
  if (req.user.role.type !== 2) {
    return next(
      customError(
        "Access denied: You are not authorized to perform this action. Please contact support for assistance.",
        403
      )
    );
  }
  next();
};

// Check if the user has the 'Admin' role
const isAdmin = async (req, res, next) => {
  if (req.user.role.type !== 1) {
    return next(
      customError(
        "Access denied: You are not authorized to perform this action. Please contact support for assistance.",
        403
      )
    );
  }
  next();
};

const isAdminORUser = async (req, res, next) => {
  const roleType = req.user.role.type;
  if (![1, 2].includes(roleType)) {
    return next(
      customError(
        "Access denied: You are not authorized to perform this action. Please contact support for assistance.",
        403
      )
    );
  }
  next();
};

module.exports = {
  isUser,
  isAdmin,
  isAdminORUser,
};
