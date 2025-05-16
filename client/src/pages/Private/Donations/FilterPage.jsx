// import React, { useCallback, useMemo } from "react";
// import Table from "../../../components/Table";
// import {
//   useReadDonationMonthly,
//   useReadDonationYearly,
// } from "../../../apis/donations";

// const FilterPage = ({ month, year, setpdfData }) => {
//   const pdfDataHandler = (d = []) => {
//     if (d) {
//       let rows = [];
//       let headers = [];
//       if (d?.donation_sum) {
//         rows = [
//           {
//             id: 1,
//             monthName: month ? d?.month : d?.year,
//             // date: new Date(o?.donation_date).toDateString(),
//             donation_amount: d?.donation_sum,
//           },
//         ];
//         headers = [
//           {
//             Header: month ? "Month Name" : "Year Name",
//             accessor: "monthName",
//             Cell: ({ value }) => value || "N/A",
//           },

//           {
//             Header: "Total Donations",
//             accessor: "donation_amount",
//             Cell: ({ value }) => value || "N/A",
//           },
//         ];
//       }

//       setpdfData({ rows, headers });
//     }
//   };
//   const {
//     isLoading,
//     data: resp,
//     refetch,
//     error,
//     isRefetching: monthlyIsRefetching,
//   } = useReadDonationMonthly({ month });
//   const {
//     isLoading: yearlyLoading,
//     data: yearlyresp,
//     refetch: yearlyRfetch,
//     error: yearlyError,
//     isRefetching: yearlyIsRefetching,
//   } = useReadDonationYearly({ year });
//   let respo = resp || yearlyresp;

//   let data = useMemo(() => {
//     pdfDataHandler(respo);
//     if (respo?.donation_sum) {
//       return [
//         {
//           id: 1,
//           monthName: month ? respo?.month : respo?.year,
//           // date: new Date(o?.donation_date).toDateString(),
//           donation_amount: respo?.donation_sum,
//           viewDetails: (
//             <button className="bg-blue-900 px-3 rounded-full text-white dark:bg-gray-900">
//               View
//             </button>
//           ),
//         },
//       ];
//     }
//   }, [resp, yearlyresp]);
//   // if (data?.length) data = [data[0]];
//   // Columns configuration
//   const columns = [
//     {
//       Header: month ? "Month Name" : "Year Name",
//       accessor: "monthName",
//       Cell: ({ value }) => value || "N/A",
//     },

//     {
//       Header: "Total Donations",
//       accessor: "donation_amount",
//       Cell: ({ value }) => value || "N/A",
//     },
//     {
//       Header: "View Details",
//       accessor: "viewDetails",
//       Cell: ({ value }) => value || "N/A",
//     },
//   ];

//   useCallback(() => {
//     refetch();
//   }, [month]);

//   useCallback(() => {
//     yearlyRfetch();
//   }, [year]);

//   return (
//     <>
//       <Table
//         columns={columns}
//         data={data}
//         loading={isLoading || yearlyLoading}
//         err={error || yearlyError}
//         refetching={monthlyIsRefetching || yearlyIsRefetching}
//       />
//     </>
//   );
// };

// export default FilterPage;
