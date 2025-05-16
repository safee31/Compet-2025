import { objectToFormData } from "../../utils/files";
import { apiBase } from "../apiBase";

// Define the dynamic prefix for onboarding
const prefix = "employee/onboarding";

export const onboardingApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch Personal Info
    getPersonalInfo: builder.query({
      query: () => ({
        url: `${prefix}/personal-info`, // Use dynamic prefix
        method: "GET",
        credentials: "include", // Auto-handles authentication cookies
      }),
      providesTags: ["Onboarding", "Employee"],
    }),

    // Add Personal Info
    createPersonalInfo: builder.mutation({
      query: (body) => ({
        url: `${prefix}/personal-info`, // Use dynamic prefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),

    // Update Personal Info
    updatePersonalInfo: builder.mutation({
      query: (body) => ({
        url: `${prefix}/personal-info`, // Use dynamic prefix
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),

    // Fetch Work Info
    getWorkInfo: builder.query({
      query: () => ({
        url: `${prefix}/work-info`, // Use dynamic prefix
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Onboarding", "Employee"],
    }),

    // Add Work Info
    createWorkInfo: builder.mutation({
      query: (body) => ({
        url: `${prefix}/work-info`, // Use dynamic prefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),

    // Update Work Info
    updateWorkInfo: builder.mutation({
      query: (body) => ({
        url: `${prefix}/work-info`, // Use dynamic prefix
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),
    getEmployeeForm: builder.query({
      query: () => ({
        url: `${prefix}/emp-form`, // Use dynamic prefix
        method: "GET",
        credentials: "include", // Auto-handles authentication cookies
      }),
      providesTags: ["Onboarding", "Employee"],
    }),

    // Add or Update Employee Form
    createEmpForm: builder.mutation({
      query: (body) => ({
        url: `${prefix}/emp-form`, // Use dynamic prefix
        method: "POST",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),
    // Add or Update Employee Form
    updateEmpForm: builder.mutation({
      query: (body) => ({
        url: `${prefix}/emp-form`, // Use dynamic prefix
        method: "PUT",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),

    submitOnbaordAnswers: builder.mutation({
      query: (body) => ({
        url: `${prefix}/answers`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Onboarding", "Verify"],
    }),
  }),
});

export const {
  useGetPersonalInfoQuery,
  useCreatePersonalInfoMutation,
  useUpdatePersonalInfoMutation,
  useGetWorkInfoQuery,
  useCreateWorkInfoMutation,
  useUpdateWorkInfoMutation,
  useGetEmployeeFormQuery,
  useCreateEmpFormMutation,
  useUpdateEmpFormMutation,
  useSubmitOnbaordAnswersMutation,
} = onboardingApi;
