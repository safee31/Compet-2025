import React from "react";
import AnalyticCard from "./UI/AnalyticCard";

const Analytics = () => {
  const data = [
    {
      label: "Balance",
      value: "500",
      color: "cyan-300",
      imageSrc: "/images/wallet.png",
    },
    {
      label: "Donations",
      value: "5200",
      color: "blue-300",
      imageSrc: "/images/donations.png",
    },
    {
      label: "Total",
      value: "5200",
      color: "teal-300",
      imageSrc: "/images/spending-money.png",
    },
    {
      label: "Expenses",
      value: "5200",
      color: "sky-300",
      imageSrc: "/images/expenses.png",
    },
    {
      label: "Beneficiaries",
      value: "0",
      color: "cyan-300",
      imageSrc: "/images/benif.png",
    },
    {
      label: "Remainings",
      value: "0",
      color: "gray-300",
      imageSrc: "/images/wallet.png",
    },
  ];

  return (
    <>
      {data.map((o, i) => (
        <AnalyticCard item={o} key={i + 1} />
      ))}
    </>
  );
};

export default Analytics;
