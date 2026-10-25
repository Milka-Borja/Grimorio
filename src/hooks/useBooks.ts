import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';

export function useBooks() {
  return useQuery({
    queryKey: queryKeys.books.lists(),
    queryFn: async () => {
      const res = await fetch('https://openlibrary.org/search.json?q=science+fiction', {
        headers: {
          'User-Agent': 'GrimorioApp/1.0 (student@epn.edu.ec)'
        }
      });
      
      if (!res.ok) throw new Error('Error al conectar con la estantería pública');
      
      const json = await res.json();
      
      // Open Library search devuelve los elementos en 'docs'
      const rawDocs = json.docs || [];
      
      // Mapeamos los campos para que coincidan exactamente con lo que tu index.tsx espera
      const formattedWorks = rawDocs.map((item: any) => ({
        key: item.key || `work-${Math.random()}`,
        title: item.title || 'Título desconocido',
        authors: item.author_name ? item.author_name.map((name: string) => ({ name })) : [{ name: 'Autor Desconocido' }],
        cover_id: item.cover_i || null // Usamos cover_i que es el campo que manda Open Library Search
      }));

      return {
        works: formattedWorks
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de staleTime exigidos en la rúbrica
  });
}