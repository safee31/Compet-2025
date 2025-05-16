// import React, { useState } from "react";
// import Button from "../../../components/Buttons";
// import { useCreateDonation } from "../../../apis/donations";
// import toast from "react-hot-toast";

// const CreateRecipt = ({ setIsForm }) => {
//   const [donationForm, setDonationForm] = useState({ charity_type: "Others" });
//   const { mutateAsync: CreateRecipt, isLoading } = useCreateDonation();
//   const handleFormChange = (e) => {
//     const { value, name } = e?.target;
//     setDonationForm({ ...donationForm, [name]: value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !donationForm?.name?.trim() ||
//       !donationForm?.son_of ||
//       !donationForm?.phone ||
//       !donationForm?.address ||
//       !donationForm?.charity_type
//     ) {
//       toast.error("All Fields Required!");
//       return;
//     }
//     CreateRecipt(donationForm, {
//       onSuccess: (r) => {
//         toast.success(r?.message || "Recipt Created!");
//       },
//       onSettled: () => {
//         setDonationForm({});
//         setIsForm(false);
//       },
//     });
//   };
//   return (
//     <div className="p-3 sm:p-10 bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-lg mt-5">
//       <h2 className="font-bold">Add following details to create receipt.</h2>
//       <button
//         onClick={() => {
//           setIsForm(false);
//         }}
//         className="px-3 my-4 bg-blue-900 text-white rounded-full"
//       >
//         Go Back
//       </button>
//       <form
//         className="w-full max-w-lg mx-auto bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
//         onSubmit={handleFormSubmit}
//       >
//         <div className="flex flex-wrap -mx-3 mb-6">
//           <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//             <label
//               className="block tracking-wide text-sm font-bold mb-1"
//               htmlFor="grid-name"
//             >
//               Name
//             </label>
//             <input
//               required
//               autoComplete="off"
//               onChange={handleFormChange}
//               name="name"
//               className="w-full bg-gray-200 text-black rounded dark:bg-white dark:text-black border-gray-400 py-2 px-3"
//               id="grid-name"
//               type="text"
//               placeholder="Name"
//             />
//           </div>
//           <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
//             <label
//               className="block tracking-wide text-gray-700 dark:text-white text-sm font-bold mb-1"
//               htmlFor="grid-SO"
//             >
//               S/O
//             </label>
//             <input
//               autoComplete="off"
//               required
//               onChange={handleFormChange}
//               className="w-full bg-gray-200 text-black rounded dark:bg-white dark:text-black border-gray-400 py-2 px-3"
//               id="grid-SO"
//               name="son_of"
//               type="text"
//               placeholder="S/O"
//             />
//           </div>
//         </div>
//         <div className="flex flex-wrap -mx-3 mb-6">
//           <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//             <label
//               className="block  tracking-wide text-gray-700 dark:text-white text-sm font-bold mb-1"
//               htmlFor="grid-pamount"
//             >
//               Phone
//             </label>
//             <input
//               required
//               autoComplete="off"
//               onChange={handleFormChange}
//               className="w-full bg-gray-200 text-black rounded dark:bg-white dark:text-black border-gray-400 py-2 px-3"
//               id="grid-pamount"
//               name="phone"
//               type="tel"
//               placeholder="xxxxxxxx"
//             />
//           </div>
//           <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
//             <label
//               className="block tracking-wide text-gray-700 dark:text-white text-sm font-bold mb-1"
//               htmlFor="grid-IO"
//             >
//               Address
//             </label>
//             <input
//               autoComplete="off"
//               required
//               onChange={handleFormChange}
//               className="w-full bg-gray-200 text-black rounded dark:bg-white dark:text-black border-gray-400 py-2 px-3"
//               id="grid-IO"
//               name="address"
//               type="text"
//               placeholder="Address"
//             />
//           </div>
//         </div>
//         <div className="flex flex-wrap -mx-3 mb-6">
//           <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//             <label
//               className="block  tracking-wide text-gray-700 dark:text-white text-sm font-bold mb-1"
//               htmlFor="grid-amount"
//             >
//               Donation Amount
//             </label>
//             <input
//               autoComplete="off"
//               required
//               onChange={handleFormChange}
//               className="w-full bg-gray-200 text-black rounded dark:bg-white dark:text-black border-gray-400 py-2 px-3"
//               id="grid-amount"
//               type="number"
//               min={0}
//               name="donation_amount"
//               placeholder="1000"
//             />
//           </div>
//           <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
//             <label
//               className="block tracking-wide text-gray-700 dark:text-white text-sm font-bold mb-1"
//               htmlFor="grid-charity"
//             >
//               Charity Type
//             </label>
//             <select
//               id="grid-charity"
//               required
//               autoComplete="off"
//               onChange={handleFormChange}
//               name="charity_type"
//               className="w-full bg-gray-200 text-black rounded dark:bg-white dark:text-black border-gray-400 py-2 px-3"
//             >
//               <option value={"Others"}>Others</option>
//               <option value={"Zakat"}>Zakat</option>
//               <option value={"Hadiya"}>Hadiya</option>
//               <option value={"Sadka"}>Sadkaa</option>
//             </select>
//           </div>
//         </div>
//         <div className="text-center">
//           <button
//             disabled={isLoading}
//             type="submit"
//             className={
//               "bg-blue-900 disabled:opacity-50 rounded-lg mx-auto text-white text-sm font-bold py-2 w-full sm:w-1/2"
//             }
//           >
//             Add Reciept
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateRecipt;
