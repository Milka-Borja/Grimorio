import { Slot } from 'expo-router';
import { QueryClient, onlineManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { createFavorite, updateFavorite, deleteFavorite } from '../api/mockApi.service';

onlineManager.setEventListener((setOnline) => {
  const checkNetwork = async () => {
    const state = await Network.getNetworkStateAsync();
    setOnline(!!state.isConnected);
  };
  checkNetwork();
  return () => {}; 
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
      staleTime: 1000 * 60 * 5, 
      retry: 2,
    },
  },
});

queryClient.setMutationDefaults(['addReview'], {
  mutationFn: async (data: any) => {
    console.log(`[${new Date().toISOString()}] Ejecutando guardado de reseña en background...`);
    return await createFavorite(data);
  },
});

queryClient.setMutationDefaults(['editReview'], {
  mutationFn: async (variables: { id: string; data: any }) => {
    console.log(`[${new Date().toISOString()}] Ejecutando edición de reseña en background...`);
    return await updateFavorite(variables);
  },
});

queryClient.setMutationDefaults(['deleteReview'], {
  mutationFn: async (id: string) => {
    console.log(`[${new Date().toISOString()}] Ejecutando eliminación de reseña en background...`);
    return await deleteFavorite(id);
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          console.log("Mutaciones pausadas reanudadas.");
        });
      }}
    >
      <Slot />
    </PersistQueryClientProvider>
  );
}