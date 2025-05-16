import { apiBase } from '../apiBase'

// Define the dynamic prefix for survey API
const prefix = 'announcements'

export const announcementsApi = apiBase.injectEndpoints({
  endpoints: builder => ({
    // Create or Update announcement by Admin
    createOrUpdateAnnouncemnt: builder.mutation({
      query: body => ({
        url: `${prefix}/`,
        method: 'POST',
        body,
        credentials: 'include'
      }),
      invalidatesTags: ['AdminAnnouncements']
    }),

    // Get Active announcements
    getActiveAnnouncements: builder.query({
      query: params => ({
        url: `${prefix}/`,
        method: 'GET',
        params,
        credentials: 'include'
      }),
      providesTags: ['AdminAnnouncements'],
      transformResponse: r => r?.data
    }),

    // Get Active announcements
    getActiveAnnouncementsForEmployeeManger: builder.query({
        query: params => ({
          url: `${prefix}/`,
          method: 'GET',
          params,
          credentials: 'include'
        }),
        providesTags: ['Announcements'],
        transformResponse: r => r?.data,
        keepUnusedDataFor: 1
      }),

    // Dismiss announcement by Employee
    dismissAnnouncement: builder.mutation({
      query: body => ({
        url: `${prefix}/dismiss`,
        method: 'PATCH',
        body,
        credentials: 'include'
      }),
      invalidatesTags: ['Announcements']
    })
  })
})

export const {
  useCreateOrUpdateAnnouncemntMutation,
  useDismissAnnouncementMutation,
  useGetActiveAnnouncementsQuery,
  useGetActiveAnnouncementsForEmployeeMangerQuery
} = announcementsApi
