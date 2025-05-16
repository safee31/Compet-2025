// import React, { useMemo } from "react";
// import Table from "../../../components/Table";
// import { useReadDonations } from "../../../apis/donations";

// const Default = ({ setpdfData }) => {
//   const { isLoading, data: resp, error, isRefetching } = useReadDonations();

//   const pdfDataHandler = (d = []) => {
//     if (d.length) {
//       let rows = d?.map((o) => {
//         return {
//           date: new Date(o?.donation_date).toLocaleDateString(),
//           serialNo: o?.serial_no,
//           name: o?.name,
//           fatherName: o?.son_of,
//           amount: o?.donation_amount,
//           charityType: o?.charity_type,
//         };
//       });
//       let headers = [
//         {
//           Header: "Date",
//           accessor: "date",
//           Cell: (p) => p?.value || "N/A",
//         },
//         {
//           Header: "Serial No",
//           accessor: "serialNo",
//           Cell: (p) => p?.value || "N/A",
//         },
//         {
//           Header: "Name",
//           accessor: "name",
//           Cell: (p) => p?.value || "N/A",
//         },
//         {
//           Header: "Father Name",
//           accessor: "fatherName",
//           Cell: (p) => p?.value || "N/A",
//         },

//         {
//           Header: "Amount",
//           accessor: "amount",
//           Cell: (p) => p?.value || "N/A",
//         },
//         {
//           Header: "Charity Type",
//           accessor: "charityType",
//           Cell: (p) => p?.value || "N/A",
//         },
//       ];
//       setpdfData({ rows, headers });
//     }
//   };

//   const columns = useMemo(
//     () => [
//       {
//         Header: "Date",
//         accessor: "date",
//         Cell: (p) => p?.value || "N/A",
//       },
//       {
//         Header: "Serial No",
//         accessor: "serialNo",
//         Cell: (p) => p?.value || "N/A",
//       },
//       {
//         Header: "Name",
//         accessor: "name",
//         Cell: (p) => p?.value || "N/A",
//       },
//       {
//         Header: "Father Name",
//         accessor: "fatherName",
//         Cell: (p) => p?.value || "N/A",
//       },
//       // {
//       //   Header: "Online/ By Hand",
//       //   accessor: "onlineByHand",
//       // },
//       {
//         Header: "Amount",
//         accessor: "amount",
//         Cell: (p) => p?.value || "N/A",
//       },
//       {
//         Header: "Charity Type",
//         accessor: "charityType",
//         Cell: (p) => p?.value || "N/A",
//       },
//       {
//         Header: "Action",
//         accessor: "details",
//         Cell: (p) => p?.value || "N/A",
//       },
//     ],
//     []
//   );
//   const data = useMemo(() => {
//     pdfDataHandler(resp);
//     return resp?.map((o) => {
//       return {
//         date: new Date(o?.donation_date).toDateString(),
//         serialNo: o?.serial_no,
//         name: o?.name,
//         fatherName: o?.son_of,
//         // onlineByHand: "Online",
//         details: (
//           <button className="px-3 bg-blue-900 dark:bg-gray-900 text-white rounded-full">
//             Details
//           </button>
//         ),
//         amount: o?.donation_amount,
//         charityType: o?.charity_type,
//       };
//     });
//   }, [resp]);
//   return (
//     <>
//       <Table
//         columns={columns}
//         data={data}
//         refetching={isRefetching}
//         loading={isLoading}
//         err={error}
//       />
//     </>
//   );
// };

// export default Default;
