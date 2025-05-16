import toast from "react-hot-toast";

export const errorMessages = (error) => {
  let message = "An unexpected error occurred.";

  if (error?.data || error?.response) {
    // Handle errors related to server response
    message =
      error?.data?.message ||
      error.response?.data?.message ||
      error?.message ||
      error.response?.data?.error ||
      error?.data?.error ||
      "Error in server response!";
  } else if (error?.request) {
    // Handle errors related to request not getting a response
    message = "Server not responding!";
  } else if (error?.message) {
    // Handle generic errors
    message = error.message;
  }

  toast.error(message);
  console.error(error);
  return { message };
};

export const successMessages = (response) => {
  let message = "Action successful!";

  if (response?.status === 200 || response?.status === 201) {
    const { data } = response;
    if (typeof data === "string") {
      message = data;
    } else if (data?.message) {
      message = data.message;
    }
  } else if (typeof response === "string") {
    message = response;
  } else {
    console.log(response);
  }

  toast.success(message);
  return { message };
};
