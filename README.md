# 📚 Aplicación React Native Offline-First con TanStack Query y MockAPI

Aplicación móvil desarrollada en React Native con Expo, diseñada para la gestión de tomos y reseñas de libros. Implementa una arquitectura robusta de sincronización y persistencia local basada en **TanStack Query** para garantizar una experiencia de usuario fluida incluso en escenarios sin conexión a internet[cite: 1].

---

## 🛠️ Tecnologías Principales
* **React Native / Expo** (con Expo Router).
* **TanStack Query v5** (@tanstack/react-query).
* **Persistencia y Caché:** `@tanstack/query-async-storage-persister` & `@react-native-async-storage/async-storage`[cite: 1].
* **Gestión de Red:** `expo-network` & `onlineManager`[cite: 1].
* **Backend simulado:** MockAPI (REST API gratuita).

---

## 📝 Explicación de Requisitos Técnicos (Rúbrica - Deber 4)

### 1. Claves de Consulta (`queryKeys.ts`) e Invalidación
Las claves de consulta se encuentran centralizadas en el archivo `src/api/queryKeys.ts` utilizando una estructura jerárquica clara[cite: 1]:
* `queryKeys.publicApi.all`: Gestiona las consultas de la API pública (Open Library).
* `queryKeys.mockApi.all`: Raíz para los datos locales propios.
* `queryKeys.mockApi.reviews()`: Clave específica para la lista de reseñas de libros.

**¿Qué clave se invalida después de cada mutación y por qué?**
Tras ejecutar mutaciones de creación (`addReview`), edición (`editReview`) o eliminación (`deleteReview`), se invoca explícitamente `queryClient.invalidateQueries({ queryKey: queryKeys.mockApi.reviews() })`[cite: 1]. 
* **Por qué:** Esta invalidación marca la caché de las reseñas como obsoleta (stale), forzando a TanStack Query a realizar una recarga en segundo plano (background refetch) para sincronizar inmediatamente los cambios locales con la base de datos remota de MockAPI en cuanto se restablece la conexión.

---

### 2. Justificación de `staleTime` y `gcTime`
Se han configurado valores diferenciados en el `QueryClient` para optimizar el rendimiento y el consumo de datos:
* **API Pública (Open Library):**
  * `staleTime`: **5 minutos** (Los catálogos literarios públicos cambian con poca frecuencia, por lo que se evita realizar peticiones HTTP repetitivas innecesarias).
* **MockAPI (Datos propios / Reseñas):**
  * `staleTime`: **1 minuto** (Las notas y estados de lectura del usuario son dinámicos y requieren una frescura de datos más estrecha).
* **`gcTime` (Garbage Collection Time):**
  * Configurado globalmente en **24 horas**[cite: 1].

**Relación entre `gcTime` y el `maxAge` del Persister:**
* En nuestra configuración, el `maxAge` del `PersistQueryClientProvider` está establecido exactamente en **24 horas**, coincidiendo con el `gcTime`[cite: 1].
* **¿Qué pasaría si el `gcTime` fuera menor que el `maxAge`?** Si el tiempo de recolección de basura fuera inferior al tiempo máximo de persistencia, TanStack Query eliminaría de la memoria interna los datos inactivos antes de que el persister intente restaurarlos desde el `AsyncStorage`, provocando la pérdida de la caché almacenada y rompiendo la carga instantánea al reiniciar la aplicación sin red[cite: 1].

---

### 3. Estrategia de Persistencia y Modo Offline
* **Persistencia local:** Se utiliza `PersistQueryClientProvider` en conjunto con `AsyncStorage`[cite: 1]. Al iniciar la aplicación, los datos guardados previamente se muestran de manera instantánea desde la caché local antes de que finalice la consulta GET en red[cite: 1].
* **Mutaciones sin conexión (`Offline Mutations`):**
  * El `onlineManager` se encuentra enlazado a `expo-network` para detectar de forma nativa los cambios de conectividad[cite: 1].
  * Las funciones de mutación están registradas mediante `setMutationDefaults` en el layout principal[cite: 1].
  * Al reconectarse a internet, se invoca `resumePausedMutations()` dentro del evento `onSuccess` del provider, asegurando que las acciones pendientes ejecutadas sin red se envíen automáticamente a MockAPI[cite: 1].
  * Las tarjetas reflejan visualmente un indicador de estado `⏳ Pendiente` mediante actualizaciones optimistas locales.

---

## 🚀 Guía de Instalación y Ejecución local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Milka-Borja/Grimorio.git

2. Instalar las dependencias:
   ```bash
   npm install
3. Configurar las variables de entorno:
   Duplicar el archivo .env.example y renombrarlo a .env.

4. Añadir tu endpoint de MockAPI:

   
   EXPO_PUBLIC_MOCKAPI_URL=[https://tu-id.mockapi.io/api/v1](https://tu-id.mockapi.io/api/v1)
   
6. Ejecutar la aplicación en desarrollo:
```bash
npx expo start
