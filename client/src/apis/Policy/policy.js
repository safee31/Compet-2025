import { objectToFormData } from "../../utils/files";
import { apiBase } from "../apiBase";

// Define the dynamic prefix for meetings API
const prefix = "policy";

export const policyApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all meetings (Admin, Manager & Employee)
    getAllPolicies: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["Policy"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch a specific meeting by ID (Admin, Manager & Employee)
    getPolicyById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Policy", id }],
    }),

    // Schedule a new meeting (Admin & Manager)
    createPolicy: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["Policy"],
    }),

    // Update a meeting (Admin & Manager)
    updatePolicy: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body: objectToFormData(body),
        credentials: "include",
      }),
      invalidatesTags: ["Policy"],
    }),

    // Delete a meeting (Admin)
    deletePolicy: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Policy"],
    }),
  }),
});

export const {
  useGetAllPoliciesQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,
} = policyApi;
