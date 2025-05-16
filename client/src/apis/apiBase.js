import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, PROJECT_NAME } from "../constants";

export const apiBase = createApi({
  reducerPath: PROJECT_NAME,
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL + "/api/" }),
  tagTypes: [
    "Employee",
    "Onboarding",
    "Admin",
    "Manager",
    "Company",
    "Meeting",
    "Policy",
    "Newsletter",
    "Book",
    "Verify",
    "Voting",
    "AdminAnnouncements",
    "Announcements",
    "Department",
    "ViolationCode",
    "ViolationQuestions",
    "ViolationSolutions",
    "SmpTask",
    "DocumentPreview",
  ],
  endpoints: () => ({}),
});
