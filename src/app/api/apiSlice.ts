import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  availableCopies: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookResponse {
  success: boolean;
  message: string;
  data: Book[];
}

export interface BorrowSummaryItem {
  bookId: string;
  bookTitle: string;
  bookISBN: string;
  totalQuantityBorrowed: number;
}

export interface Borrow {
  _id: string;
  bookId: string;
  quantity: number;
  dueDate: string;
  borrowDate: string;
  status: 'active' | 'returned' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://fahimxgg-l2-ass-3-db.vercel.app/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Books', 'Borrows'], 
  endpoints: (builder) => ({
    getBooks: builder.query<BookResponse, { limit?: number } | void>({
      query: ({ limit } = {}) => `/books${limit ? `?limit=${limit}` : ''}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Books' as const, id: _id })),
              { type: 'Books', id: 'LIST' },
            ]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    getBookById: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Books', id }],
    }),
    createBook: builder.mutation<Book, Partial<Book>>({
      query: (newBook) => ({
        url: '/books',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),
    updateBook: builder.mutation<Book, Partial<Book> & Pick<Book, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `/books/${_id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { _id }) => [{ type: 'Books', id: _id }, { type: 'Books', id: 'LIST' }],
    }),
    deleteBook: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Books', id }, { type: 'Books', id: 'LIST' }],
    }),

    borrowBook: builder.mutation<{ message: string; borrow: Borrow; updatedBookDetails: Partial<Book> }, { bookId: string; quantity: number; dueDate: string }>({
      query: (borrowDetails) => ({
        url: '/borrows',
        method: 'POST',
        body: borrowDetails,
      }),
      
      invalidatesTags: [{ type: 'Books', id: 'LIST' }, { type: 'Borrows', id: 'SUMMARY' }],
      async onQueryStarted({ bookId, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getBooks', undefined, (draft) => {
            const bookToUpdate = draft.data.find((book) => book._id === bookId);
            if (bookToUpdate) {
              bookToUpdate.availableCopies -= quantity;
              bookToUpdate.available = bookToUpdate.availableCopies > 0;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getBorrowSummary: builder.query<BorrowSummaryItem[], void>({
      query: () => '/borrows/summary',
      providesTags: [{ type: 'Borrows', id: 'SUMMARY' }],
    }),
  }),
});


export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = api;