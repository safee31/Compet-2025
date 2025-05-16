// class customError extends Error {
//   constructor(msg, statusCode) {
//     super(msg);
//     this.statusCode = statusCode;
//   }
// }

exports.customError = (message, statusCode) => {
  let error = new Error();
  error.message = message;
  error.statusCode = statusCode;
  return error;
};
