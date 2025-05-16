import React from "react";

const Donate = () => {
  return (
    <>
      {" "}
      <div className=" p-3 sm:p-10 bg-white rounded-lg mt-5">
        <h2 className=" mb-10 font-bold">
          Share Your Blessings Spread Your Love!
        </h2>
        <form className="w-full max-w-lg mx-auto">
          <div className="flex flex-wrap -mx-3 mb-6">
            {/* <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block  tracking-wide text-gray-700 text-sm font-bold mb-1"
                htmlFor="grid-name"
              >
                Meeting Purpose
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-name"
                type="text"
                placeholder="ABC"
              />
            </div> */}
            <div className="w-full px-3">
              <label
                className="block tracking-wide text-gray-700 text-sm font-bold mb-1"
                htmlFor="grid-IO"
              >
                Select Bank
              </label>
              <select
                placeholder="Select"
                className="bg-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option>ABC</option>
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>Germany</option>
              </select>
            </div>
          </div>
          <div className="text-center flex flex-col">
            <button
              className={
                "bg-blue-900 rounded-md mx-auto mb-2 text-white text-sm font-bold py-2 px-10 w-2/3"
              }
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Donate;
