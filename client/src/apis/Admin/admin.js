import { apiBase } from "../apiBase";

// Define the dynamic prefix for admin API
const prefix = "admin";

export const adminApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all verified users (Admin only)
    getAllVerifiedUsers: builder.query({
      query: (params) => ({
        url: `${prefix}/users/verified`,
        method: "GET",
        credentials: "include",
        params,
      }),
      providesTags: ["VerifiedUsers"],
      transformResponse: (r) => r?.data,
    }),
  }),
});

export const { useGetAllVerifiedUsersQuery } = adminApi;
