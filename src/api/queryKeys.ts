export const queryKeys = {
  books: {
    all: ['books'] as const,
    lists: () => [...queryKeys.books.all, 'list'] as const,
  },
  mockApi: {
    all: ['mockApi'] as const,
    reviews: () => [...queryKeys.mockApi.all, 'reviews'] as const,
  },
};