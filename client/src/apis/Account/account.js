import { apiBase } from "../apiBase";

const prefix = "account";
export const accountApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Soft delete account (Admin only)
    markAccountAsDeleted: builder.mutation({
      query: (userId) => ({
        url: `${prefix}/delete/${userId}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Manager", "Employee", "Auth"],
      transformResponse: (response) => response?.data,
    }),

    updateProfilePhoto: builder.mutation({
      query: ({ accountId, file }) => {
        const formData = new FormData();
        if (file) formData.append("imageData", file);

        return {
          url: `${prefix}/profile-photo/${accountId}`,
          method: "PUT",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: ["Employee", "Manager", "Auth"],
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useMarkAccountAsDeletedMutation,
  useUpdateProfilePhotoMutation,
} = accountApi;
