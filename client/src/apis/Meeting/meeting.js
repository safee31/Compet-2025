import { apiBase } from "../apiBase";

// Define the dynamic prefix for meetings API
const prefix = "meetings";

export const meetingApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all meetings (Admin, Manager & Employee)
    getAllMeetings: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Meeting"],
      transformResponse: (r) => r?.data,
    }),
    getAllMeetingsForMe: builder.query({
      query: (params) => ({
        url: `${prefix}/for-me`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Meeting"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch a specific meeting by ID (Admin, Manager & Employee)
    getMeetingById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Meeting", id }],
    }),

    // Schedule a new meeting (Admin & Manager)
    createMeeting: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Meeting"],
    }),

    // Update a meeting (Admin & Manager)
    updateMeeting: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Meeting"],
    }),

    // Delete a meeting (Admin)
    deleteMeeting: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Meeting"],
    }),
  }),
});

export const {
  useGetAllMeetingsQuery,
  useGetAllMeetingsForMeQuery,
  useGetMeetingByIdQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} = meetingApi;
