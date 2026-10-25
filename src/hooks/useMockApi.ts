import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queryKeys';
import { fetchFavorites, createFavorite, updateFavorite, deleteFavorite } from '../api/mockApi.service';

export const useReviews = () => {
  return useQuery({
    queryKey: queryKeys.mockApi.reviews(),
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 1, // 1 minuto para reseñas propias
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['addReview'], // Clave para offline
    mutationFn: createFavorite,
    onMutate: async (newReview) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.mockApi.reviews() });
      const previousReviews = queryClient.getQueryData(queryKeys.mockApi.reviews());

      // Actualización optimista exigida
      queryClient.setQueryData(queryKeys.mockApi.reviews(), (old: any) => {
        const currentList = Array.isArray(old) ? old : [];
        return [...currentList, { ...newReview, id: `temp-${Date.now()}`, isPending: true }];
      });
      return { previousReviews };
    },
    onError: (err, newReview, context) => {
      if (context?.previousReviews) queryClient.setQueryData(queryKeys.mockApi.reviews(), context.previousReviews);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() }),
  });
};

export const useEditReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['editReview'],
    mutationFn: updateFavorite,
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() }),
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteReview'],
    mutationFn: deleteFavorite,
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() }),
  });
};