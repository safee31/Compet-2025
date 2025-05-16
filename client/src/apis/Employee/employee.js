import { objectToFormData } from "../../utils/files";
import { apiBase } from "../apiBase";

// Define the dynamic prefix for employees API
const prefix = "employee";

export const employeeApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all employees (Admin only)
    getAllEmployees: builder.query({
      query: (query) => ({
        url: `${prefix}`,
        method: "GET",
        credentials: "include",
        params: query,
      }),
      providesTags: ["Employee"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch employees by company (Manager only)
    getEmployeesByCompany: builder.query({
      query: () => ({
        url: `${prefix}/company`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Employee"],
      transformResponse: (r) => r?.data,
    }),
    getEmployeesById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Employee"],
      transformResponse: (r) => r?.data,
    }),

    // Update an employee's details (Admin & Manager)
    updateEmployee: builder.mutation({
      query: ({ accountId, w4, driversLicense, ...body }) => ({
        url: `${prefix}/${accountId}`,
        method: "PATCH",
        body: objectToFormData({ ...body, w4, driversLicense }),
        credentials: "include",
      }),
      invalidatesTags: ["Employee", "Manager"],
    }),

    // Toggle employee status (Activate/Deactivate) (Admin & Manager)
    toggleEmployeeStatus: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}/activation`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),
    approveEmployeeAccount: builder.mutation({
      query: (accountId) => ({
        url: `${prefix}/approve/${accountId}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["Employee"],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeesByCompanyQuery,
  useGetEmployeesByIdQuery,
  useUpdateEmployeeMutation,
  useToggleEmployeeStatusMutation,
  useApproveEmployeeAccountMutation,
} = employeeApi;
