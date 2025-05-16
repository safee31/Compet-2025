import { apiBase } from "../apiBase";

// Define the dynamic prefix for departments API
const prefix = "department";

export const departmentApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Fetch all departments (All roles)
    getAllDepartments: builder.query({
      query: (query) => ({
        url: `${prefix}`,
        method: "GET",
        credentials: "include",
        params: query,
      }),
      providesTags: ["Department"],
      transformResponse: (r) => r?.data,
    }),

    // 🔹 Fetch a single department by ID (All roles)
    getDepartmentById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Department", id }],
      transformResponse: (r) => r?.data,
    }),

    // 🔹 Create a new department (Admin only)
    createDepartment: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Department"],
    }),

    // 🔹 Update an existing department (Admin only)
    updateDepartment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Department"],
    }),

    // 🔹 Delete a department (Admin only)
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Department"],
    }),
    assignDepartmentToManager: builder.mutation({
      query: ({ departmentId, managerId }) => ({
        url: `${prefix}/${managerId}/assign`,
        method: "POST",
        body: { department: departmentId },
        credentials: "include",
      }),
      invalidatesTags: ["Department", "Manager"],
    }),

    // 🔹 Unassign a manager from a department (Admin only)
    unassignDepartmentFromManager: builder.mutation({
      query: (departmentId) => ({
        url: `${prefix}/${departmentId}/unassign`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Department", "Manager"],
    }),
  }),
});

export const {
  useGetAllDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useAssignDepartmentToManagerMutation,
  useUnassignDepartmentFromManagerMutation,
} = departmentApi;
