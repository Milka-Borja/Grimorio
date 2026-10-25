import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { fetchBooks } from '../api/books.service';

export const useBooks = () => {
  return useQuery({
    queryKey: queryKeys.books.lists(),
    queryFn: fetchBooks,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas: Los libros clásicos no cambian
  });
};