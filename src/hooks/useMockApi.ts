import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { fetchFavorites, createFavorite, updateFavorite, deleteFavorite } from '../api/mockApi.service';

export const useReviews = () => {
  return useQuery({
    queryKey: queryKeys.mockApi.reviews(),
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 1, // 1 minuto de staleTime justificado en tu README
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['addReview'],
    mutationFn: createFavorite,
    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mockApi.reviews() });
      const previousReviews = queryClient.getQueryData(queryKeys.mockApi.reviews());

      // Actualización optimista: añade el elemento con el indicador de pendiente
      queryClient.setQueryData(queryKeys.mockApi.reviews(), (old: any) => {
        const currentList = Array.isArray(old) ? old : [];
        return [...currentList, { ...newReview, id: `temp-${Date.now()}`, isPending: true }];
      });
      return { previousReviews };
    },
    onError: (err, newReview, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKeys.mockApi.reviews(), context.previousReviews);
      }
    },
    // onSuccess se ejecuta apenas la mutación llega a MockAPI con éxito (incluso al reconectarse offline)
    onSuccess: (data) => {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Mutación de creación sincronizada con éxito.`);
      // Actualizamos la caché local para quitar el isPending y poner el ID real del servidor
      queryClient.setQueryData(queryKeys.mockApi.reviews(), (old: any) => {
        const currentList = Array.isArray(old) ? old : [];
        return currentList.map((item: any) => 
          item.isPending ? { ...data, isPending: false } : item
        );
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() });
    },
  });
};

export const useEditReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['editReview'],
    mutationFn: updateFavorite,
    onMutate: async (variables: { id: string; data: any }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mockApi.reviews() });
      const previousReviews = queryClient.getQueryData(queryKeys.mockApi.reviews());

      // Actualización optimista que inyecta todos los campos editados y marca pendiente
      queryClient.setQueryData(queryKeys.mockApi.reviews(), (old: any) => {
        const currentList = Array.isArray(old) ? old : [];
        return currentList.map((item: any) => 
          item.id === variables.id ? { ...item, ...variables.data, isPending: true } : item
        );
      });

      return { previousReviews };
    },
    onError: (err, variables, context) => {
      if (context?.previousReviews) {
        queryClient.setQueryData(queryKeys.mockApi.reviews(), context.previousReviews);
      }
    },
    onSuccess: () => {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Mutación de edición sincronizada con éxito.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteReview'],
    mutationFn: deleteFavorite,
    onSuccess: () => {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Mutación de eliminación sincronizada con éxito.`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() });
    },
  });
};