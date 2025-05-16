import { apiBase } from "../apiBase";

const prefix = "violation-code";

export const violationQuestionsAndSolutionsApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    createQuestion: builder.mutation({
      query: ({ violationCodeId, body }) => ({
        url: `${prefix}/${violationCodeId}/questions`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { violationCodeId }) => [
        { type: "ViolationQuestions", violationCodeId },
        "ViolationCode",
      ],
    }),
    updateQuestion: builder.mutation({
      query: ({ violationCodeId, questionId, body }) => ({
        url: `${prefix}/${violationCodeId}/questions/${questionId}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { violationCodeId, questionId }) => [
        { type: "ViolationQuestions", violationCodeId, id: questionId },
        "ViolationCode",
      ],
    }),

    deleteQuestion: builder.mutation({
      query: ({ violationCodeId, questionId }) => ({
        url: `${prefix}/${violationCodeId}/questions/${questionId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, { violationCodeId, questionId }) => [
        { type: "ViolationQuestions", violationCodeId, id: questionId },
        "ViolationCode",
      ],
    }),

    updateSolution: builder.mutation({
      query: ({ violationCodeId, solutionId, body }) => ({
        url: `${prefix}/${violationCodeId}/solutions/${solutionId}`,
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { violationCodeId, solutionId }) => [
        { type: "ViolationSolutions", violationCodeId, id: solutionId },
        "ViolationCode",
      ],
    }),

    createSolution: builder.mutation({
      query: ({ violationCodeId, body }) => ({
        url: `${prefix}/${violationCodeId}/solutions`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { violationCodeId }) => [
        { type: "ViolationSolutions", violationCodeId },
        "ViolationCode",
      ],
    }),

    deleteSolution: builder.mutation({
      query: ({ violationCodeId, solutionId }) => ({
        url: `${prefix}/${violationCodeId}/solutions/${solutionId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, { violationCodeId, solutionId }) => [
        { type: "ViolationSolutions", violationCodeId, id: solutionId },
        "ViolationCode",
      ],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useCreateSolutionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateSolutionMutation,
  useDeleteSolutionMutation,
} = violationQuestionsAndSolutionsApi;
