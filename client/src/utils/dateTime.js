import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const formatDateTimeFromISO = (isoDateString = null, customOptions) => {
  if (!isoDateString) {
    return "N/A";
  }
  const dateTime = new Date(isoDateString || new Date());

  const defaultOptions = {
    year: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
  };
  customOptions = { ...customOptions };
  const options = customOptions || defaultOptions;

  return new Intl.DateTimeFormat("en-US", options).format(dateTime);
};
export const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

// Format date as 'Month Day, Year' (e.g., June 2, 1963)
export const formatDateStatic = (
  isoDateString = null,
  format = "MM/DD/YYYY"
) => {
  if (!isoDateString) return "N/A";
  return dayjs.utc(isoDateString).format(format);
};
