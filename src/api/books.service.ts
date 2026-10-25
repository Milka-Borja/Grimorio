const BASE_URL = process.env.EXPO_PUBLIC_OPEN_LIBRARY_URL;

export const fetchBooks = async () => {
  const res = await fetch(`${BASE_URL}/subjects/science_fiction.json?limit=20`);
  if (!res.ok) throw new Error('Error al cargar la biblioteca');
  return res.json(); // Devuelve un objeto con la propiedad "works"
};