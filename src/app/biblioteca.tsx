import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';

import { useReviews, useEditReview, useDeleteReview } from '../hooks/useMockApi'; 
import ReviewItem from '../components/ReviewItem';

export default function BibliotecaScreen() {
  const { data: reviews, isLoading } = useReviews();
  const editReview = useEditReview();
  const deleteReview = useDeleteReview();
  
  const [activeFilter, setActiveFilter] = useState('Todos');

  if (isLoading && !reviews) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c8a97e" />
      </View>
    );
  }

  // Filtrado optimizado por estado
  const filteredReviews = reviews?.filter((review: any) => {
    if (activeFilter === 'Todos') return true;
    return review.status === activeFilter;
  }) || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>← VOLVER</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>TOMOS GUARDADOS</Text>
        
        {/* Filtros */}
        <View style={styles.filterContainer}>
          {['Todos', 'Por leer', 'Leyendo', 'Leído'].map((filter) => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterTabText, activeFilter === filter && styles.filterTabTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredReviews.length === 0 ? (
        <Text style={styles.emptyText}>No hay tomos con este sello.</Text>
      ) : (
        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <ReviewItem 
              item={item} 
              editReview={editReview} 
              deleteReview={deleteReview} 
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161412' },
  header: { padding: 24, paddingTop: 60, backgroundColor: '#1c1917', borderBottomWidth: 1, borderColor: '#362f2a' },
  backButton: { alignSelf: 'flex-start', paddingVertical: 6, marginBottom: 12 },
  backButtonText: { color: '#c8a97e', fontFamily: 'serif', fontSize: 13, letterSpacing: 1, fontWeight: 'bold' },
  title: { fontSize: 22, fontFamily: 'serif', color: '#e6dfd5', letterSpacing: 2, marginBottom: 16 },
  
  filterContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterTab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#362f2a', backgroundColor: '#161412' },
  filterTabActive: { backgroundColor: '#c8a97e', borderColor: '#c8a97e' },
  filterTabText: { color: '#8c7b6d', fontSize: 12, fontFamily: 'serif' },
  filterTabTextActive: { color: '#161412', fontWeight: 'bold' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#161412' },
  emptyText: { color: '#8c7b6d', textAlign: 'center', marginTop: 60, fontFamily: 'serif', fontStyle: 'italic', fontSize: 16 },
  listContainer: { padding: 16 },
});