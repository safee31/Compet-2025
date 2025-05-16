export const toTitleCase = (str) => {
  return String(str).replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};
export const getDocumentId = (doc = null) => {
  if (typeof doc === "object") {
    return doc?._id || doc?.id || "";
  }
  return null;
};
// utils/validators.js

export const emailRegex = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};
export const getMin0Number = (value = 0) => {
  const parsedValue = parseFloat(value);
  return !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : 0;
};
export const maskValue = (value) => (value ? "•".repeat(value.length) : "");
