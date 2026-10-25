import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { useBooks } from '../hooks/useBooks';
import { useAddReview } from '../hooks/useMockApi';

export default function CatalogScreen() {
  const { data, isLoading, isError } = useBooks();
  const addReview = useAddReview(); 

  if (isLoading && !data) return <View style={styles.center}><ActivityIndicator size="large" color="#c8a97e" /></View>;
  if (isError) return <View style={styles.center}><Text style={styles.error}>Las estanterías están selladas (Error).</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EL GRIMORIO</Text>
        <Text style={styles.subtitle}>Archivos de Ciencia Ficción</Text>
        <Link href="/biblioteca" asChild>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>✦ Ver Tomos Guardados</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={data?.works || []}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const author = item.authors?.[0]?.name || 'Autor Desconocido';
          const coverUrl = item.cover_id ? `https://covers.openlibrary.org/b/id/${item.cover_id}-M.jpg` : 'https://via.placeholder.com/120x180/241f1c/c8a97e?text=Sin+Tapa';
          
          return (
            <View style={styles.bookCard}>
              <Image source={{ uri: coverUrl }} style={styles.coverImage} />
              <View style={styles.bookInfo}>
                <View>
                  <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.bookAuthor}>{author}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={() => {
                    addReview.mutate({ 
                      bookId: item.key, 
                      bookTitle: item.title, 
                      review: '', 
                      status: 'Por leer' 
                    });
                    Alert.alert('Conjuro Exitoso', `"${item.title}" añadido a tu colección.`);
                  }}>
                  <Text style={styles.addButtonText}>+ Añadir al Grimorio</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161412' }, 
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1c1917', borderBottomWidth: 1, borderColor: '#362f2a', alignItems: 'center' },
  title: { fontSize: 26, fontFamily: 'serif', color: '#c8a97e', letterSpacing: 2 }, 
  subtitle: { fontSize: 13, color: '#8c7b6d', marginBottom: 20, fontStyle: 'italic' },
  navButton: { backgroundColor: '#2a2420', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#52453b' },
  navButtonText: { color: '#e6dfd5', fontFamily: 'serif', fontSize: 15, letterSpacing: 1 },
  listContainer: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#161412' },
  error: { color: '#c8a97e', fontSize: 16, fontFamily: 'serif' },
  
  bookCard: { flexDirection: 'row', backgroundColor: '#201c19', borderRadius: 12, marginBottom: 16, overflow: 'hidden', elevation: 4, borderWidth: 1, borderColor: '#362f2a' },
  coverImage: { width: 100, height: 150, backgroundColor: '#1c1917' },
  bookInfo: { flex: 1, padding: 16, justifyContent: 'space-between' },
  bookTitle: { fontSize: 17, fontFamily: 'serif', color: '#e6dfd5', marginBottom: 4, fontWeight: 'bold' },
  bookAuthor: { fontSize: 13, color: '#8c7b6d', fontStyle: 'italic' },
  addButton: { backgroundColor: '#c8a97e', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
  addButtonText: { color: '#161412', fontFamily: 'serif', fontSize: 13, fontWeight: 'bold' },
});