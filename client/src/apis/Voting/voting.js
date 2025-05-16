import { apiBase } from "../apiBase";

// Define the dynamic prefix for survey API
const prefix = "voting";

export const votingApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Cast a Vote (Employee)
    castVote: builder.mutation({
      query: (body) => ({
        url: `${prefix}/vote`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Voting"],
    }),

    // Get Nominee
    getNominee: builder.query({
      query: (params) => ({
        url: `${prefix}/nominee`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Voting"],
      transformResponse: (r) => r?.data,
    }),

    // Get Voting Sesion
    getVotingSession: builder.query({
      query: (params) => ({
        url: `${prefix}/status`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Voting"],
      //   transformResponse: r => r?.data
    }),

    // Get Voting Sesion
    getPreviousWinners: builder.query({
      query: (params) => ({
        url: `${prefix}/winners/${params.year}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Voting"],
      transformResponse: (r) => r?.data,
    }),

    // Get Live Result
    getLiveWinners: builder.query({
      query: (params) => ({
        url: `${prefix}/live`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Voting"],
      transformResponse: (r) => r?.data,
    }),
    getVotes: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Voting"],
      transformResponse: (r) => r?.data,
    }),
    ignoreVote: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${prefix}/${id}/ignore`,
        method: "PUT",
        body: { reason },
        credentials: "include",
      }),
      invalidatesTags: ["Voting"],
    }),
    calculateWinner: builder.mutation({
      query: () => ({
        url: `${prefix}/calculate-winner`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
      invalidatesTags: ["Voting"],
    }),
    markAsOverallWinner: builder.mutation({
      query: (data) => ({
        url: `${prefix}/mark-overall-winner`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Voting"],
    }),
  }),
});

export const {
  useCastVoteMutation,
  useGetNomineeQuery,
  useGetVotingSessionQuery,
  useGetPreviousWinnersQuery,
  useGetLiveWinnersQuery,
  useGetVotesQuery,
  useIgnoreVoteMutation,
  useCalculateWinnerMutation,
  useMarkAsOverallWinnerMutation
} = votingApi;
