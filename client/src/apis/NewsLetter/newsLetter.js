import { objectToFormData } from "../../utils/files";
import { apiBase } from "../apiBase";

const prefix = "newsletters"; // Dynamic prefix

export const newsletterApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all newsletters
    getAllNewsletters: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Newsletter"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch a newsletter by ID
    getNewsletterById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Newsletter", id }],
    }),

    // Create a new newsletter (with file upload support)
    createNewsletter: builder.mutation({
      query: (data) => ({
        url: `${prefix}`,
        method: "POST",
        body: objectToFormData(data),
        credentials: "include",
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Update a newsletter (with file upload support)
    updateNewsletter: builder.mutation({
      query: ({ id, data }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body: objectToFormData(data),
        credentials: "include",
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Delete a newsletter
    deleteNewsletter: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Newsletter"],
    }),

    toggleNewsletterArchiveStatus: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}/archive`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Newsletter"],
    }),
  }),
});

export const {
  useGetAllNewslettersQuery,
  useGetNewsletterByIdQuery,
  useCreateNewsletterMutation,
  useUpdateNewsletterMutation,
  useToggleNewsletterArchiveStatusMutation,
  useDeleteNewsletterMutation,
} = newsletterApi;
