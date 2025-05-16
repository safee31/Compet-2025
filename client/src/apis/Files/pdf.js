import { apiBase } from "../apiBase";

// Define the dynamic prefix for file handling
const prefix = "files"; // Adjust this based on your backend API

export const fileApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Bulk Upload Files (PDFs only)
    uploadFiles: builder.mutation({
      query: (formData) => ({
        url: `${prefix}/upload`,
        method: "POST",
        credentials: "include",
        body: formData,
      }),
    }),

    // File download (single file)
    downloadFile: builder.query({
      query: (fileName) => ({
        url: `${prefix}/download/${fileName}`, // Download endpoint for files
        method: "GET",
        credentials: "include",
      }),
    }),

    // Update single file (replaces existing file)
    updateFile: builder.mutation({
      query: ({ fileName, formData }) => ({
        url: `${prefix}/update/${fileName}`, // Endpoint for file update
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
    }),

    // Delete a file
    deleteFile: builder.mutation({
      query: (fileName) => ({
        url: `${prefix}/delete/${fileName}`, // Delete file endpoint
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUploadFilesMutation,
  useDownloadFileQuery,
  useUpdateFileMutation,
  useDeleteFileMutation,
} = fileApi;
