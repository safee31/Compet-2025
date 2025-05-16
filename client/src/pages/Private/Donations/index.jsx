// import { useState, useEffect } from "react";
// // import Analytics from "../../../components/analytics";
// import CreateRecipt from "./CreateRecipt";
// import PageTabs from "./PageTabs";
// // import { useDateSelector } from "../../../components/UI/Datepicker";
// // import Default from "./Default";
// // import FilterPage from "./FilterPage";
// // import { requestForToken } from "../../../firebase";
// // import { useBindNotify } from "../../../apis/bindNotifications";
// // import Table from "../../../components/Table";
// // import FilterPage from "./FilterPage";

// const Page = () => {
//   const { mutateAsync } = useBindNotify();
//   useEffect(() => {
//     // Request permission and get the token

//     Notification.requestPermission().then((permission) => {
//       if (permission === "granted") {
//         // If the requestForToken is successful, you will get the FCM token
//         Promise.resolve(requestForToken()).then((token) => {
//           // console.log("MyToken: ", token);
//           mutateAsync({ token });
//         });
//       }
//     });

//     // Handle incoming messages
//   }, []);
//   const [isForm, setIsForm] = useState(false);
//   // const [tabsIndex, setTabsIndex] = useState(1);
//   // console.log({ selectedMonth, selectedYear });
//   return (
//     <>
//       {isForm ? (
//         <CreateRecipt setIsForm={setIsForm} />
//       ) : (
//         <>
//           <PageTabs
//             tabName={"Donations"}
//             setIsForm={setIsForm}
//             // MonthlySelector={MonthlySelector}
//             // YearlySelector={YearlySelector}
//             // setSelectedMonth={setSelectedMonth}
//             // setSelectedYear={setSelectedYear}
//             // selectedMonth={selectedMonth}
//             // selectedYear={selectedYear}
//           ></PageTabs>
//         </>
//       )}
//     </>
//   );
//   // <div className='flex'>
//   //   <div className='w-3/12'>
//   //   </div>
//   //   <div className='flex flex-col w-9/12'>
//   //     {/* <div className=''>
//   //     </div> */}
//   //   </div>
//   // </div>
// };

// export default Page;
