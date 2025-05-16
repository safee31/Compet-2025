export default function Modal({ setOpen, open = true }) {
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="backdrop-brightness-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-100 max-h-full"
    >
      <div className="relative p-4 w-full max-w-4xl m-auto max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-3 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Terms of Service
            </h3>
            <button type="button" className="" data-modal-hide="default-modal">
              {/* <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg> */}
              See all
            </button>
          </div>
          {/* Modal body */}
          <div className="p-3 ">
            <ul className="">
              <li className="p-4 rounded-lg border-b">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/images/donations.png"
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      email@flowbite.com
                    </p>
                  </div>
                  <div className="inline-flex cursor-pointer items-center text-base font-semibold text-gray-900 dark:text-white">
                    <span className="bg-red-500 rounded-full font-bold py-1 text-white px-2.5">
                      &#10005;
                    </span>
                    <span className="bg-green-500 ml-3 rounded-full font-bold py-1 text-white px-2.5">
                      &#10003;
                    </span>
                  </div>
                </div>
              </li>
              <li className="p-4 rounded-lg border-b">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/images/donations.png"
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      email@flowbite.com
                    </p>
                  </div>
                  <div className="inline-flex cursor-pointer items-center text-base font-semibold text-gray-900 dark:text-white">
                    <span className="bg-red-500 rounded-full font-bold py-1 text-white px-2.5">
                      &#10005;
                    </span>
                    <span className="bg-green-500 ml-3 rounded-full font-bold py-1 text-white px-2.5">
                      &#10003;
                    </span>
                  </div>
                </div>
              </li>
              <li className="p-4 rounded-lg border-b">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/images/donations.png"
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      email@flowbite.com
                    </p>
                  </div>
                  <div className="inline-flex cursor-pointer items-center text-base font-semibold text-gray-900 dark:text-white">
                    <span className="bg-red-500 rounded-full font-bold py-1 text-white px-2.5">
                      &#10005;
                    </span>
                    <span className="bg-green-500 ml-3 rounded-full font-bold py-1 text-white px-2.5">
                      &#10003;
                    </span>
                  </div>
                </div>
              </li>
              <li className="p-4 rounded-lg border-b">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src="/images/donations.png"
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      email@flowbite.com
                    </p>
                  </div>
                  <div className="inline-flex cursor-pointer items-center text-base font-semibold text-gray-900 dark:text-white">
                    <span className="bg-red-500 rounded-full font-bold py-1 text-white px-2.5">
                      &#10005;
                    </span>
                    <span className="bg-green-500 ml-3 rounded-full font-bold py-1 text-white px-2.5">
                      &#10003;
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          {/* Modal footer */}
          {/* <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-hide="default-modal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              I accept
            </button>
            <button
              data-modal-hide="default-modal"
              type="button"
              className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Decline
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
