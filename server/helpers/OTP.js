// // OTP generation function
// exports.generateOTPCode = async function generateCode(length = 4) {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const code = Array.from({ length }, () =>
//     characters.charAt(Math.floor(Math.random() * characters.length))
//   ).join("");

//   // Ensure the code has at least one letter and one number
//   const hasLetter = /[a-zA-Z]/.test(code);
//   const hasNumber = /[0-9]/.test(code);

//   return hasLetter && hasNumber ? code : generateCode(length);
// };

// OTP generation function - Numeric only (4 digits)
exports.generateOTPCode = function generateCode(length = 4) {
  // Generate random 4-digit number
  const min = 1000; // Smallest 4-digit number
  const max = 9999; // Largest 4-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
