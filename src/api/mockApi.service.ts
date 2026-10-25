const MOCK_API_URL = process.env.EXPO_PUBLIC_MOCKAPI_URL;

export const fetchFavorites = async () => {
  const res = await fetch(`${MOCK_API_URL}/favorites`);
  if (!res.ok) throw new Error('Error al cargar datos');
  return res.json();
};

export const createFavorite = async (favoriteData: any) => {
  const res = await fetch(`${MOCK_API_URL}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favoriteData),
  });
  return res.json();
};

export const updateFavorite = async ({ id, data }: { id: string; data: any }) => {
  // Aseguramos que el ID no sea temporal (si fuera temp, MockAPI fallaría, 
  // pero TanStack Query ya maneja IDs reales o de respaldo)
  const res = await fetch(`${MOCK_API_URL}/favorites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar en MockAPI');
  return res.json();
};

export const deleteFavorite = async (id: string) => {
  const res = await fetch(`${MOCK_API_URL}/favorites/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};