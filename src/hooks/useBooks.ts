import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';

export function useBooks() {
  return useQuery({
    queryKey: queryKeys.books.lists(), // Usando tu estructura jerárquica correcta
    queryFn: async () => {
      const res = await fetch('https://openlibrary.org/search.json?q=science+fiction', {
        headers: {
          'User-Agent': 'GrimorioApp/1.0 (student@epn.edu.ec)'
        }
      });
      if (!res.ok) throw new Error('Error al conectar con la estantería pública');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de staleTime justificados en tu README
  });
}