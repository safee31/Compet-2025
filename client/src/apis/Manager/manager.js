import { apiBase } from "../apiBase";

// Define the dynamic prefix for manager API
const prefix = "managers";

export const managerApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    getAllManagers: builder.query({
      query: (params) => ({
        url: `${prefix}`, // Use dynamic prefix
        method: "GET",
        params,
        credentials: "include", // Auto-handles authentication cookies
      }),
      providesTags: ["Manager"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch manager by ID
    getManagerById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`, // Use dynamic prefix
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Manager"],
    }),

    // Create a new manager
    createManager: builder.mutation({
      query: (body) => ({
        url: `${prefix}`, // Use dynamic prefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),

    // Update manager information
    updateManager: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`, // Use dynamic prefix
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),

    // Delete a manager
    deleteManager: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`, // Use dynamic prefix
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),
    toggleManagerActivation: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}/activation`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Manager"],
    }),
  }),
});

export const {
  useGetAllManagersQuery,
  useGetManagerByIdQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useToggleManagerActivationMutation,
  useDeleteManagerMutation,
} = managerApi;
