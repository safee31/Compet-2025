import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const UTCDatePicker = ({
  value = null,
  onChange = () => {},
  format = "MM/DD/YYYY",
  textFieldProps = {},
  ...props
}) => {
  const handleChange = (date) => {
    if (!onChange) return;
    const isoDate = date ? date.startOf("day").format("YYYY-MM-DD") : null;
    onChange(isoDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...props}
        format={format}
        value={value ? dayjs.utc(value) : null}
        onChange={handleChange}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
            ...textFieldProps,
          },
        }}
      />
    </LocalizationProvider>
  );
};
