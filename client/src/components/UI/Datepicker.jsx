import React, { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const useDateSelector = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleMonthChange = (date) => {
    setSelectedYear(null);
    setSelectedMonth(date);
    // setTabsIndex(2);
  };

  const handleYearChange = (date) => {
    setSelectedMonth(null);
    setSelectedYear(date);
    // setTabsIndex(3);
  };

  const MonthlySelector = ({ placeholderText = "Select" }) => {
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <button
        className="example-custom-input flex items-center"
        onClick={onClick}
        ref={ref}
      >
        <span role="tab">{value || placeholderText}</span>
        <img
          src="/svgs/calenderDark.svg"
          className="ml-1"
          width={16}
          height={16}
        />
      </button>
    ));
    return (
      <DatePicker
        className=" bg-transparent cursor-pointer w-44 px-"
        // isClearable
        selected={selectedMonth}
        onChange={handleMonthChange}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        placeholderText={placeholderText}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        // showIcon
        calendarIconClassname="absolute right-4 mt-0.5"
        // icon={
        //   <img
        //     src="/svgs/calenderDark.svg"
        //     className="ml-1"
        //     width={16}
        //     height={16}
        //   />
        // }
        customInput={<ExampleCustomInput />}
      />
    );
  };

  const YearlySelector = ({ placeholderText = "Select" }) => {
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <button
        className="example-custom-input flex items-center"
        onClick={onClick}
        ref={ref}
      >
        <span role="tab">{value || placeholderText}</span>
        <img
          src="/svgs/calenderDark.svg"
          className="ml-1"
          width={16}
          height={16}
        />
      </button>
    ));
    return (
      <DatePicker
        className=" bg-transparent cursor-pointer w-44 px-"
        // isClearable
        selected={selectedYear}
        onChange={handleYearChange}
        dateFormat="yyyy"
        showYearPicker
        placeholderText={placeholderText}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={15}
        // showIcon
        calendarIconClassname="absolute right-4 mt-0.5"
        // icon={
        //   <img
        //     src="/svgs/calenderDark.svg"
        //     className="ml-1"
        //     width={16}
        //     height={16}
        //   />
        // }
        customInput={<ExampleCustomInput />}
      />
    );
  };

  return {
    MonthlySelector,
    YearlySelector,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  };
};
