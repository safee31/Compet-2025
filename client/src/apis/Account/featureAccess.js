import { apiBase } from "../apiBase";

const prefix = "account/feature-access";
export const accountApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    toggleBulkSmpViolationAccess: builder.mutation({
      query: (payload) => ({
        url: `${prefix}/bulk-smp-violation`,
        method: "PUT",
        body: { ...payload },
        credentials: "include",
      }),
      invalidatesTags: ["VerifiedUsers"],
    }),
  }),
  overrideExisting: false,
});

export const { useToggleBulkSmpViolationAccessMutation } = accountApi;
