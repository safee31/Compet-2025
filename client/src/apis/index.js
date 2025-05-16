// import { useCallback, useState } from "react";
// import { myAxios } from "./myaxios";

// export const useAxios = (
//   options = {},
//   onSuccess = () => {},
//   onError = () => {}
// ) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false); // Set initial loading state to false

//   const triggerRequest = useCallback(async (requestOptions = {}) => {
//     setLoading(true);
//     try {
//       const response = await myAxios({ ...options, ...requestOptions });
//       setData(response.data);
//       onSuccess(response?.data);
//       setError(null); // Reset error state upon successful request
//     } catch (error) {
//       if (error?.response) {
//         // The request was made, but the server responded with a status code that falls out of the range of 2xx
//         setError(error.response.data);
//       } else if (error.request) {
//         // The request was made but no response was received
//         setError("Server not responding!");
//       } else {
//         // Something happened in setting up the request that triggered an error
//         setError("Error in making the request");
//       }
//       onError(error);
//     }
//     setLoading(false);
//   }, []);

//   // Function to manually trigger the API request
//   // const triggerRequest = async (requestOptions = {}) => {
//   //   await fetchData(requestOptions);
//   // };

//   return {
//     data,
//     error,
//     loading,
//     triggerRequest,
//     setData,
//     setLoading,
//     setError,
//   };
// };
