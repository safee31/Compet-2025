import { apiBase } from "../apiBase";

// Define the dynamic prefix for survey API
const prefix = "surveys";

export const surveyApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all surveys (Admin & Manager)
    getAllSurveys: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Survey"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch a survey by ID (Admin, Manager & Employee)
    getSurveyById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Survey", id }],
    }),
    // Fetch a survey of today (Manager & Employee)
    getEmpSurveyOfToday: builder.query({
      query: (id) => ({
        url: `${prefix}/employee-today`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Survey", id }],
    }),

    // Create a new survey (Admin & Manager)
    createSurvey: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Survey"],
    }),
    // Update a new survey (Admin & Manager)
    updateSurvey: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Survey"],
    }),

    // Submit a response to a survey (Employee)
    submitSurveyResponse: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}/respond`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Survey"],
    }),

    deleteSurveySubmission: builder.mutation({
      query: ({ id, surveyId }) => ({
        url: `${prefix}/${id}/delete-submission/${surveyId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Survey"],
    }),

    // Get survey results (Admin & Manager)
    getSurveyResults: builder.query({
      query: ({ survey, ...params }) => ({
        url: `${prefix}/${survey}/results`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Survey", id }],
      transformResponse: (r) => r?.data,
    }),

    // Delete a survey (Admin & Manager)
    deleteSurvey: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Survey"],
    }),
  }),
});

export const {
  useGetAllSurveysQuery,
  useGetSurveyByIdQuery,
  useGetEmpSurveyOfTodayQuery,
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
  useSubmitSurveyResponseMutation,
  useDeleteSurveySubmissionMutation,
  useGetSurveyResultsQuery,
  useDeleteSurveyMutation,
} = surveyApi;
