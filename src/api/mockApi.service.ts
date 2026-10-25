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
  const res = await fetch(`${MOCK_API_URL}/favorites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteFavorite = async (id: string) => {
  const res = await fetch(`${MOCK_API_URL}/favorites/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};