import { objectToFormData } from "../../utils/files";
import { apiBase } from "../apiBase";

// Define the dynamic prefix for company API
const prefix = "companies";

export const companyApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all companies
    getAllPublicCompanies: builder.query({
      query: (params) => ({
        url: `${prefix}/pub`, // Use dynamic prefix
        method: "GET",
        params,
        credentials: "include", // Auto-handles authentication cookies
      }),
      providesTags: ["Company"],
      transformResponse: (r) => r?.data,
    }),
    getAllCompanies: builder.query({
      query: (params) => ({
        url: `${prefix}`, // Use dynamic prefix
        method: "GET",
        params,
        credentials: "include", // Auto-handles authentication cookies
      }),
      providesTags: ["Company"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch company by ID
    getCompanyById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`, // Use dynamic prefix
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Company", id }],
    }),

    // Create a new company
    createCompany: builder.mutation({
      query: (body) => ({
        url: `${prefix}`, // Use dynamic prefix
        method: "POST",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // Update company information
    updateCompany: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`, // Use dynamic prefix
        method: "PUT",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // Delete a company
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`, // Use dynamic prefix
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // Assign manager to a company
    assignManager: builder.mutation({
      query: (body) => ({
        url: `${prefix}/assign`, // Use dynamic prefix
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    // Fetch employees by company
    getEmployeesByCompanyId: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}/employees`, // Use dynamic prefix
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Company", id }],
    }),
  }),
});

export const {
  useGetAllPublicCompaniesQuery,
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useAssignManagerMutation,
  useGetEmployeesByCompanyIdQuery,
} = companyApi;
