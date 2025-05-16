import { objectToFormData } from "../../utils/files";
import { apiBase } from "../apiBase";

const prefix = "smp-task";

export const smpTaskApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks (User-specific)
    getAllTasks: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["SmpTask"],
      transformResponse: (response) => response?.data,
    }),

    // Get task progress
    getTaskProgress: builder.query({
      query: (taskId) => ({
        url: `${prefix}/${taskId}/progress`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, taskId) => [
        { type: "SmpTask", id: taskId },
      ],
    }),

    // Create new task
    createTask: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["SmpTask"],
    }),
    // Update new task
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["SmpTask"],
    }),

    // Start QA session (Admin/Manager)
    startQASession: builder.mutation({
      query: (taskId) => ({
        url: `${prefix}/${taskId}/start-qa`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: (result, error, taskId) => [
        { type: "SmpTask", id: taskId },
        "SmpTask",
      ],
    }),

    // Submit QA answers
    submitQASession: builder.mutation({
      query: ({ taskId, answers }) => ({
        url: `${prefix}/${taskId}/submit-qa`,
        method: "POST",
        body: { answers },
        credentials: "include",
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "SmpTask", id: taskId },
      ],
    }),

    // Delete task
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `${prefix}/${taskId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["SmpTask"],
    }),

    getDocumentPreview: builder.query({
      query: ({ key }) => ({
        url: `${prefix}/preview-doc`,
        method: "GET",
        params: { key },
        credentials: "include",
        responseHandler: (response) => response.blob(), // tell RTK we want a binary stream
      }),
      providesTags: (result, error, { key }) => [
        { type: "DocumentPreview", id: key },
      ],
    }),
    saveDocContent: builder.mutation({
      query: (payload) => ({
        url: `${prefix}/save-doc-content/${payload?.task}`,
        method: "PUT",
        body: payload?.formData,
        credentials: "include",
      }),
      invalidatesTags: ["SmpTask"],
    }),
  }),
  overrideExisting: "throw",
});

export const {
  useGetAllTasksQuery,
  useGetTaskProgressQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useStartQASessionMutation,
  useSubmitQASessionMutation,
  useDeleteTaskMutation,
  useGetDocumentPreviewQuery,
  useSaveDocContentMutation,
} = smpTaskApi;
