import React from "react";
import { SpinnerMd } from "./Spinner";

const PageWaiting = ({ err, loading, data }) => {
  if (loading) {
    return <SpinnerMd />;
  }
  if (err) {
    return (
      <p className="text-red-500 font-bold text-center p-2">
        {err?.message || "Failed to fetch data!"}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-red-500 font-bold text-center p-2">No data Found!</p>
    );
  }
};

export default PageWaiting;
