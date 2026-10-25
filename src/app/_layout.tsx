import React, { useEffect } from 'react';
import { AppState, Platform, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, onlineManager, focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

// 1. Importamos tus funciones del servicio de MockAPI
import { createFavorite, updateFavorite, deleteFavorite } from '../api/mockApi.service';

// 2. Configurar onlineManager con expo-network (Requisito del deber)
onlineManager.setEventListener((setOnline) => {
  const subscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected && !!state.isInternetReachable);
  });
  return () => {
    subscription.remove();
  };
});

// 3. Crear el Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Requisito: gcTime debe ser igual o mayor que el maxAge del persister
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
      // Requisito: Valores distintos de staleTime
      staleTime: 1000 * 60 * 5, // 5 minutos 
      retry: 2,
    },
  },
});

// 4. Crear el Persister con AsyncStorage
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

// 5. Registrar funciones de mutación con setMutationDefaults (OBLIGATORIO PARA OFFLINE)
queryClient.setMutationDefaults(['addReview'], {
  mutationFn: async (data: any) => {
    console.log(`[${new Date().toLocaleTimeString()}] Ejecutando creación offline en background...`);
    return await createFavorite(data);
  },
});

queryClient.setMutationDefaults(['editReview'], {
  mutationFn: async (variables: { id: string; data: any }) => {
    console.log(`[${new Date().toLocaleTimeString()}] Ejecutando edición offline con datos completos...`);
    // Enviamos explícitamente el objeto data empaquetado para que MockAPI conserve la reseña, estado, página y estrellas
    return await updateFavorite({ 
      id: variables.id, 
      data: {
        bookTitle: variables.data.bookTitle,
        review: variables.data.review,
        status: variables.data.status,
        page: variables.data.page || '',
        rating: variables.data.rating || 0
      } 
    });
  },
});

queryClient.setMutationDefaults(['deleteReview'], {
  mutationFn: async (id: string) => {
    console.log(`[${new Date().toLocaleTimeString()}] Ejecutando eliminación offline en background...`);
    return await deleteFavorite(id);
  },
});

export default function RootLayout() {
  // Manejo de foco de la app para refrescar queries al volver a primer plano
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content"/>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ 
          persister: asyncStoragePersister, 
          maxAge: 1000 * 60 * 60 * 24 // 24 horas (igual o menor que gcTime)
        }}
        onSuccess={() => {
          // Requisito: Llamar a resumePausedMutations() en el onSuccess
          console.log(`[${new Date().toLocaleTimeString()}] Restaurando caché y mutaciones pausadas...`);
          queryClient.resumePausedMutations();
        }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </PersistQueryClientProvider>
    </>
  );
}