import { apiBase } from "../apiBase";

// Define the authPrefix dynamically
const authPrefix = "auth/employee";

export const employeeApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Register Employee
    registerEmployee: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/signup`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include", // Ensures cookies are sent and received
      }),
      invalidatesTags: ["Employee"],
    }),

    // Employee Login
    loginEmployee: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/login`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),

    // Verify Employee Email
    verifyEmployeeEmail: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/verify-email`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),
    // Send OTP
    sendUserOTP: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/send-otp`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),
    verifyUserOTP: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/verify-otp`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/forgot-password`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `${authPrefix}/reset-password`, // Use dynamic authPrefix
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Fetch Authenticated Employee Data
    readEmployee: builder.query({
      query: () => ({
        url: `${authPrefix}/authenticate`, // Use dynamic authPrefix
        method: "POST",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Verify"],
    }),

    // Logout Employee
    logoutEmployee: builder.mutation({
      query: () => ({
        url: `${authPrefix}/logout`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const {
  useRegisterEmployeeMutation,
  useLoginEmployeeMutation,
  useVerifyEmployeeEmailMutation,
  useSendUserOTPMutation,
  useVerifyUserOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useReadEmployeeQuery,
  useLogoutEmployeeMutation,
} = employeeApi;
