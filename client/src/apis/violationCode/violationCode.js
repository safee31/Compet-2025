import { apiBase } from "../apiBase";

const prefix = "violation-code";

export const violationCodeApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch all violation codes
    getAllViolationFactors: builder.query({
      query: (params) => ({
        url: `${prefix}/factors`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["ViolationFactor"],
      transformResponse: (res) => res?.data,
    }),
    getAllViolationCodes: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: ["ViolationCode"],
      transformResponse: (res) => res?.data,
    }),

    // ✅ Fetch a violation code by ID
    getViolationCodeById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "ViolationCode", id }],
    }),

    // ✅ Create a violation code
    createViolationCode: builder.mutation({
      query: (body) => ({
        url: `${prefix}`,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["ViolationCode"],
    }),

    // ✅ Update a violation code
    updateViolationCode: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["ViolationCode"],
    }),

    // ✅ Delete a violation code
    deleteViolationCode: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["ViolationCode"],
    }),
  }),
});

export const {
  useGetAllViolationFactorsQuery,
  useGetAllViolationCodesQuery,
  useGetViolationCodeByIdQuery,
  useCreateViolationCodeMutation,
  useUpdateViolationCodeMutation,
  useDeleteViolationCodeMutation,
} = violationCodeApi;
