import { apiBase } from "../apiBase";

// Define the dynamic prefix for book API
const prefix = "books";

export const bookApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all books
    getAllBooks: builder.query({
      query: (params) => ({
        url: `${prefix}`,
        method: "GET",
        params,
        credentials: "include", // Auto-handles authentication cookies
      }),
      providesTags: ["Book"],
      transformResponse: (r) => r?.data,
    }),

    // Fetch books for employees
    getEmployeeBooks: builder.query({
      query: params => ({
        url: `${prefix}/user/list`,
        method: 'GET',
        params,
        credentials: 'include' // Auto-handles authentication cookies
      }),
      providesTags: ['Books'],
      transformResponse: r => r?.data
    }),

    // Mark book as read for employee
    markBookAsRead: builder.mutation({
      query: id => ({
        url: `${prefix}/${id}/mark-as-read`,
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: ['Books']
    }),

    // Fetch book by ID
    getBookById: builder.query({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),

    // Create a new book
    createBook: builder.mutation({
      query: (formData) => ({
        url: `${prefix}`,
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Book"],
    }),

    // Update a book (using PATCH to match your express route)
    updateBook: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${prefix}/${id}`,
        method: "PATCH",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Book"],
    }),

    // Delete a book
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `${prefix}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useGetEmployeeBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useMarkBookAsReadMutation
} = bookApi
