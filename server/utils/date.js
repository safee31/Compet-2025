const moment = require("moment");

const getPreviousMonthFirstDate = () => {
  return moment().utc().subtract(1, "months").startOf("month").toDate();
};
const getCurrentMonthMonthFirstDate = () => {
  return moment().utc().startOf("month").toDate();
};

module.exports = { getPreviousMonthFirstDate, getCurrentMonthMonthFirstDate };
