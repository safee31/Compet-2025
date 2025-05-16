import { apiBase } from '../apiBase'

// Define the dynamic prefix for survey API
const prefix = 'analytics'

export const analyticsApi = apiBase.injectEndpoints({
  endpoints: builder => ({
 
    // Get survey stats for employee
    getSurveyStatsForEmployee: builder.query({
      query: params => ({
        url: `${prefix}/survey-stats/employee`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    // Get survey stats for manager
    getSurveyStatsForManager: builder.query({
      query: params => ({
        url: `${prefix}/survey-stats/manager`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),
    // Get survey stats for admin
    getSurveyStatsForAdmin: builder.query({
      query: params => ({
        url: `${prefix}/survey-stats/admin`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getPreviousMonthWinner: builder.query({
      query: params => ({
        url: `${prefix}/previous-month-winner`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getHappinesDataOfCompany: builder.query({
      query: params => ({
        url: `${prefix}/happiness/company`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getHappinesData: builder.query({
      query: params => ({
        url: `${prefix}/happiness`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getLatestNewsLetter: builder.query({
      query: params => ({
        url: `${prefix}/latest-newsletter`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getNextSurveysDays: builder.query({
      query: params => ({
        url: `${prefix}/admin/next-survey-days`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getNewSurveysSubmissionForManager: builder.query({
      query: params => ({
        url: `${prefix}/new-surveys/manager`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getNewSurveysSubmissionForAdmin: builder.query({
      query: params => ({
        url: `${prefix}/new-surveys/admin`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),

    getNewBooksCreated: builder.query({
      query: params => ({
        url: `${prefix}/new-books`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      transformResponse: r => r?.data
    }),


  
  })
})

export const {
  useGetPreviousMonthWinnerQuery,
  useGetHappinesDataOfCompanyQuery,
  useGetLatestNewsLetterQuery,
  useGetHappinesDataQuery,
  useGetSurveyStatsForEmployeeQuery,
  useGetSurveyStatsForAdminQuery,
  useGetSurveyStatsForManagerQuery,
  useGetNextSurveysDaysQuery,
  useGetNewSurveysSubmissionForAdminQuery,
  useGetNewSurveysSubmissionForManagerQuery,
  useGetNewBooksCreatedQuery
} = analyticsApi
