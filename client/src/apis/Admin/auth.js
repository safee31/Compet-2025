import { apiBase } from "../apiBase";

export const adminAuthApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Admin Signup
    registerAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/signup",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Admin"],
    }),

    // Admin Login
    loginAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/login",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Admin"],
    }),

    // Verify Admin Email (OTP)
    verifyAdminEmail: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/verify-email",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Forgot Password (Request OTP)
    forgotAdminPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/forgot-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Reset Password (Verify OTP & Reset)
    resetAdminPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/reset-password",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),

    // Fetch Authenticated Admin Info
    readAdmin: builder.query({
      query: () => ({
        url: "/admin/auth/authenticate",
        method: "POST",
        credentials: "include",
      }),
      providesTags: ["Admin"],
    }),

    // Logout Admin
    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/admin/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useRegisterAdminMutation,
  useLoginAdminMutation,
  useVerifyAdminEmailMutation,
  useForgotAdminPasswordMutation,
  useResetAdminPasswordMutation,
  useReadAdminQuery,
  useLogoutAdminMutation,
} = adminAuthApi;
