export const Popup = ({
  isDisabled = false,
  isOpen,
  handleSubmit,
  closeModal,
  children = "HTML",
  title = "",
}) => {
  return (
    <>
      {isOpen && (
        <div
          id="static-modal"
          data-modal-backdrop="static"
          data-modal-placement="top-right"
          tabIndex={-1}
          aria-hidden="true"
          className="overflow-auto fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center backdrop-brightness-50"
        >
          <div className="relative sm:max-w-7xl sm:min-w-fit min-w-[99vw] scrollbox">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-lg w-full text-black dark:text-white dark:bg-gray-900">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-900">
                <h3 className="text-xl font-semibold">{title}</h3>
                <button
                  disabled={isDisabled}
                  type="button"
                  className="text-gray-400 disabled:opacity-50 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={closeModal}
                >
                  <svg
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
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="p-3 sm:p-5 space-y-4 max-h-full overflow-auto scrollbox">
                {children}
              </div>
              {/* Modal footer */}
              <div className="flex items-center p-4 md:p-5 border-t border-gray-200">
                <button
                  disabled={isDisabled}
                  onClick={handleSubmit}
                  className={
                    "rounded-full mr-3 disabled:opacity-50 dark:bg-gray-900 dark:text-white hover:bg-blue-900 px-3 duration-300 hover:text-white bg-none border-2 border-blue-900"
                  }
                >
                  Done
                </button>
                <button
                  disabled={isDisabled}
                  onClick={closeModal}
                  className={
                    "rounded-full disabled:opacity-50 dark:bg-gray-900 text-white px-3 hover:bg-orange-800 duration-300 bg-orange-900 border-2 border-orange-900"
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
