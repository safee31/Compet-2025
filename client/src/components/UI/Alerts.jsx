import toast, { Toaster } from "react-hot-toast";

// const Alert = ({ type = "", message = "", handleClose = () => {} }) => {
//   // const [isVisible, setIsVisible] = useState(true);

//   let bgColor = "";
//   let textColor = "";
//   let borderColor = "";

//   switch (type) {
//     case "info":
//       bgColor = "bg-blue-50";
//       textColor = "text-blue-800";
//       borderColor = "border-blue-300";
//       break;
//     case "error":
//       bgColor = "bg-red-50";
//       textColor = "text-red-800";
//       borderColor = "border-red-300";
//       break;
//     case "success":
//       bgColor = "bg-green-50";
//       textColor = "text-green-800";
//       borderColor = "border-green-300";
//       break;
//     case "warning":
//       bgColor = "bg-yellow-50";
//       textColor = "text-yellow-800";
//       borderColor = "border-yellow-300";
//       break;
//     default:
//       bgColor = "bg-gray-50";
//       textColor = "text-gray-800";
//       borderColor = "border-gray-300";
//   }

//   // const handleClose = () => {
//   //   setIsVisible("");
//   // };

//   return (
//     <>
//       {message && (
//         <div
//           className={`flex items-center p-3 shadow-xl max-w-md absolute top-2 right-2 m-2 mb-4 text-sm ${textColor} border ${borderColor} rounded-lg ${bgColor} dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600`}
//           role="alert"
//         >
//           <svg
//             className="flex-shrink-0 inline w-4 h-4 me-2"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
//           </svg>
//           <span className="sr-only">Info</span>
//           <div className=" whitespace-normal">
//             <span className="font-medium">
//               {type && type.charAt(0).toUpperCase() + type.slice(1) + "! "}
//             </span>
//             {message}
//           </div>
//           <button onClick={handleClose} className="focus:outline-none ml-2">
//             <svg
//               className="w-6 h-6 text-gray-500 hover:text-gray-700 cursor-pointer"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5.293 5.293a1 1 0 0 1 1.414 0L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414L11.414 10l3.293 3.293a1 1 0 1 1-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 1 1-1.414-1.414L8.586 10 5.293 6.707a1 1 0 0 1 0-1.414z"
//               />
//             </svg>
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

const ToasterWrapper = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,

          // style: {
          //   borderRadius: "10px",
          //   background: "white",
          //   color: "#fff",
          // },
          dismissible: true,
          pauseOnHover: true,
        }}
      >
        {/* {(t) => (
          <span className="bg-white shadow-lg rounded-lg p-2">
            {String(t.message)}
            <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
          </span>
        )} */}
      </Toaster>
      {children}
    </>
  );
};

export default ToasterWrapper;

// export default Alert;
