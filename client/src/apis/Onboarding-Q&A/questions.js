import { apiBase } from "../apiBase";

// Define the dynamic prefix for onboarding questions API
const prefix = "onboarding-qa";

export const onboardQuestionApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all onboarding questions (Admin, Manager & Employee)
    getAllOnboardQuestions: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["OnboardQuestion"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch a specific onboarding question by ID (Admin, Manager & Employee)
    getOnboardQuestionById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "OnboardQuestion", id }],
    }),

    // Create a new onboarding question (Admin & Manager)
    createOnboardQuestion: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["OnboardQuestion"],
    }),

    // Update an onboarding question (Admin & Manager)
    updateOnboardQuestion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["OnboardQuestion"],
    }),

    // Delete an onboarding question (Admin)
    deleteOnboardQuestion: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["OnboardQuestion"],
    }),
    getUserQuestions: builder.query({
      query: (query) => ({
        url: `${prefix}/user/list`,
        method: "GET",
        params: { ...query },
        credentials: "include",
      }),
      providesTags: ["OnboardingQuestions"],
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetAllOnboardQuestionsQuery,
  useGetOnboardQuestionByIdQuery,
  useCreateOnboardQuestionMutation,
  useUpdateOnboardQuestionMutation,
  useDeleteOnboardQuestionMutation,
  useGetUserQuestionsQuery,
} = onboardQuestionApi;
