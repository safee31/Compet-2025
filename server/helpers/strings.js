const getDocID = (obj = null) => {
  if (typeof obj === "object") {
    return obj?._id || obj?.id || "";
  } else {
    return "";
  }
};
const getMin0Number = (value = 0) => {
  const parsedValue = parseFloat(value);
  return !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : 0;
};
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
module.exports = { getDocID, getMin0Number, emailRegex };
