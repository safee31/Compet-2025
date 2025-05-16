// // import React, { useState } from "react";
// // import { useMemo } from "react";
// // import Button from "../../../components/Buttons";
// // import Table from "../../../components/Table";
// // import { useDateSelector } from "../../../components/UI/Datepicker";
// // import FilterPage from "./FilterPage";
// import { useState } from "react";
// import { useDateSelector } from "../../../components/UI/Datepicker";

// import PDFTemplate from "../../../utils/pdf";
// import Default from "./Default";
// import FilterPage from "./FilterPage";

// const PageTabs = ({ tabName, setIsForm }) => {
//   const [pdfData, setpdfData] = useState({ headers: [], rows: [] });
//   const {
//     MonthlySelector,
//     YearlySelector,
//     setSelectedMonth,
//     setSelectedYear,
//     selectedMonth,
//     selectedYear,
//   } = useDateSelector();

//   // console.log(pdfData);
//   return (
//     <>
//       <div className="flex justify-between flex-wrap items-center gap-y-3 py-4 px-2">
//         <div>
//           <ul className="flex list-none flex-wrap gap-y-3 flex-row p-0 gap-x-8 cursor-pointer font-semibold">
//             <li
//               onClick={() => {
//                 setSelectedMonth(null);
//                 setSelectedYear(null);
//               }}
//               role="presentation"
//               className={`${
//                 !selectedMonth && !selectedYear ? "text-black" : "text-gray-500"
//               }`}
//             >
//               <span role="tab">All {tabName || ""}</span>
//             </li>
//             <li
//               // onClick={() => {
//               //   setTabsIndex(2);
//               // }}
//               role="presentation"
//               className={`${
//                 selectedMonth ? "text-black" : "text-gray-500"
//               } flex items-center`}
//             >
//               <MonthlySelector placeholderText="Monthly Sum" />
//             </li>
//             <li
//               // onClick={() => {
//               //   setTabsIndex(3);
//               // }}
//               role="presentation"
//               className={`${
//                 selectedYear ? "text-black" : "text-gray-500"
//               } flex items-center`}
//             >
//               <YearlySelector placeholderText="Yearly Sum" />
//             </li>
//           </ul>
//         </div>
//         <div>
//           <button
//             onClick={() => {
//               setIsForm(true);
//             }}
//             className={
//               "rounded-full mr-3 dark:bg-gray-900 dark:text-white hover:bg-blue-900 px-3 duration-300 hover:text-white bg-none border-2 border-blue-900"
//             }
//           >
//             Create Reciept
//           </button>
//           {pdfData.headers.length !== 0 && pdfData.rows.length !== 0 && (
//             <PDFTemplate
//               data={pdfData?.rows}
//               headers={pdfData?.headers}
//               fileName={tabName}
//             >
//               <button
//                 className={
//                   "rounded-full dark:bg-gray-900 text-white px-3 hover:bg-blue-800 duration-300 bg-blue-900 border-2 border-blue-900"
//                 }
//               >
//                 Export
//               </button>
//             </PDFTemplate>
//           )}
//         </div>
//       </div>
//       {!selectedMonth && !selectedYear ? (
//         <Default setpdfData={setpdfData} />
//       ) : selectedMonth ? (
//         <FilterPage setpdfData={setpdfData} month={selectedMonth} />
//       ) : (
//         <FilterPage setpdfData={setpdfData} year={selectedYear} />
//       )}
//     </>
//   );
// };

// export default PageTabs;
