import React, { useEffect } from 'react';
import { AppState, Platform, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { QueryClient, onlineManager, focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

// 1. Importamos tus funciones de MockAPI
import { createFavorite, updateFavorite, deleteFavorite } from '../api/mockApi.service';

// 2. Configurar onlineManager de manera reactiva y robusta para el arranque
onlineManager.setEventListener((setOnline) => {
  // Inicializamos en true para permitir el intento de envío al abrir con red
  setOnline(true);

  const subscription = Network.addNetworkStateListener((state) => {
    const isConnected = !!state.isConnected && !!state.isInternetReachable;
    console.log(`[${new Date().toLocaleTimeString()}] 🌐 Cambio de red detectado:`, isConnected);
    setOnline(isConnected);
    
    // Si la red pasa a estar activa, forzamos la ejecución de mutaciones pausadas inmediatamente
    if (isConnected) {
      queryClient.resumePausedMutations();
    }
  });

  // Verificación inicial asíncrona con expo-network
  Network.getNetworkStateAsync().then((state) => {
    const isConnected = !!state.isConnected && !!state.isInternetReachable;
    setOnline(isConnected);
    if (isConnected) {
      queryClient.resumePausedMutations();
    }
  });

  return () => {
    subscription.remove();
  };
});

// 3. Crear el Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 horas
      staleTime: 1000 * 60 * 5, 
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
    console.log(`[${new Date().toLocaleTimeString()}]  Sincronizando creación pendiente con MockAPI...`);
    return await createFavorite(data);
  },
});

queryClient.setMutationDefaults(['editReview'], {
  mutationFn: async (variables: { id: string; data: any }) => {
    console.log(`[${new Date().toLocaleTimeString()}]  Sincronizando edición pendiente con MockAPI...`);
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
    console.log(`[${new Date().toLocaleTimeString()}]  Sincronizando eliminación pendiente con MockAPI...`);
    return await deleteFavorite(id);
  },
});

export default function RootLayout() {
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
          maxAge: 1000 * 60 * 60 * 24 
        }}
        onSuccess={() => {
          console.log(`[${new Date().toLocaleTimeString()}]  Caché restaurada. Comprobando mutaciones...`);
          queryClient.resumePausedMutations();
        }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </PersistQueryClientProvider>
    </>
  );
}