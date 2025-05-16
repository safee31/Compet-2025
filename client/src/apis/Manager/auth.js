import { apiBase } from "../apiBase";

export const managerAuthApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Manager Signup
    registerManager: builder.mutation({
      query: (body) => ({
        url: "/manager/auth/signup",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),

    // Manager Login
    loginManager: builder.mutation({
      query: (body) => ({
        url: "/manager/auth/login",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),

    // Verify Manager Email (OTP)
    verifyManagerEmail: builder.mutation({
      query: (body) => ({
        url: "/manager/auth/verify-email",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Forgot Password (Request OTP)
    forgotManagerPassword: builder.mutation({
      query: (body) => ({
        url: "/manager/auth/forgot-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Reset Password (Verify OTP & Reset)
    resetManagerPassword: builder.mutation({
      query: (body) => ({
        url: "/manager/auth/reset-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Fetch Authenticated Manager Info
    readManager: builder.query({
      query: () => ({
        url: "/manager/auth/authenticate",
        method: "POST",
        credentials: "include",
      }),
      providesTags: ["Manager"],
    }),

    // Logout Manager
    logoutManager: builder.mutation({
      query: () => ({
        url: "/manager/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),
  }),
});

export const {
  useRegisterManagerMutation,
  useLoginManagerMutation,
  useVerifyManagerEmailMutation,
  useForgotManagerPasswordMutation,
  useResetManagerPasswordMutation,
  useReadManagerQuery,
  useLogoutManagerMutation,
} = managerAuthApi;
