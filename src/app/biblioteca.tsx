import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useReviews, useEditReview, useDeleteReview } from '../hooks/useMockApi';
import { Link } from 'expo-router';

const ReviewItem = ({ item, editReview, deleteReview }: any) => {
  const [reviewText, setReviewText] = useState(item.review || '');
  const [status, setStatus] = useState(item.status || 'Por leer');

  useEffect(() => {
    setReviewText(item.review || '');
    setStatus(item.status || 'Por leer');
  }, [item.review, item.status]);

  const isUnchanged = item.review === reviewText && item.status === status;
  const isNew = item.review === '';

  const handleUpdate = () => {
    editReview.mutate({ id: item.id, data: { ...item, review: reviewText, status } });
    Alert.alert('Tomo Actualizado', `El sello de "${item.bookTitle}" ha sido alterado.`);
  };

  const handleDelete = () => {
    Alert.alert('Quemar Página', `¿Incinerar el registro de "${item.bookTitle}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Quemar', style: 'destructive', onPress: () => deleteReview.mutate(item.id) }
    ]);
  };

  return (
    <View style={[styles.card, item.isPending && styles.cardPending]}>
      <View style={styles.cardHeader}>
        <Text style={styles.bookTitle}>✦ {item.bookTitle}</Text>
        {item.isPending && <View style={styles.pendingBadge}><Text style={styles.pendingText}>⏳ Sincronizando</Text></View>}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.tagsContainer}>
          {['Por leer', 'Leyendo', 'Leído'].map((tag) => (
            <TouchableOpacity 
              key={tag} 
              style={[styles.tagButton, status === tag && styles.tagButtonActive]} 
              onPress={() => setStatus(tag)}
            >
              <Text style={[styles.tagText, status === tag && styles.tagTextActive]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Escribe tus notas de conjuro aquí..."
          placeholderTextColor="#6a5d52"
          multiline
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.updateButton, isUnchanged && styles.updateButtonSaved]} 
            onPress={handleUpdate}
          >
            <Text style={[styles.updateButtonText, isUnchanged && styles.updateButtonTextSaved]}>
              {!isUnchanged ? 'Sellar Cambios' : (isNew ? 'Redactar Nota' : 'Alterar Nota')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>✕ Quitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function BibliotecaScreen() {
  const { data: reviews, isLoading } = useReviews();
  const editReview = useEditReview();
  const deleteReview = useDeleteReview();

  if (isLoading && !reviews) return <View style={styles.center}><ActivityIndicator size="large" color="#c8a97e" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}><Text style={styles.backButtonText}>← VOLVER</Text></TouchableOpacity>
        </Link>
        <Text style={styles.title}>TOMOS GUARDADOS</Text>
      </View>

      {reviews?.length === 0 ? (
        <Text style={styles.emptyText}>El grimorio está vacío.</Text>
      ) : (
        <FlatList
          data={reviews || []}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <ReviewItem item={item} editReview={editReview} deleteReview={deleteReview} />
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
  title: { fontSize: 22, fontFamily: 'serif', color: '#e6dfd5', letterSpacing: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#161412' },
  emptyText: { color: '#8c7b6d', textAlign: 'center', marginTop: 60, fontFamily: 'serif', fontStyle: 'italic', fontSize: 16 },
  listContainer: { padding: 16 },
  
  card: { backgroundColor: '#201c19', padding: 16, marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#362f2a', elevation: 2 },
  cardPending: { borderStyle: 'dashed', borderColor: '#c8a97e', opacity: 0.8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  bookTitle: { fontSize: 17, fontFamily: 'serif', color: '#e6dfd5', flex: 1, marginRight: 10, fontWeight: 'bold' },
  pendingBadge: { backgroundColor: '#523a1a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pendingText: { color: '#c8a97e', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  contentContainer: { gap: 0 },
  tagsContainer: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tagButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#52453b', backgroundColor: '#1c1917' },
  tagButtonActive: { backgroundColor: '#c8a97e', borderColor: '#c8a97e' },
  tagText: { color: '#8c7b6d', fontSize: 12, fontFamily: 'serif' },
  tagTextActive: { color: '#161412', fontWeight: 'bold' },
  
  input: { backgroundColor: '#161412', color: '#e6dfd5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#362f2a', minHeight: 80, textAlignVertical: 'top', fontSize: 14 },
  
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  updateButton: { flex: 1, backgroundColor: '#c8a97e', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  updateButtonSaved: { backgroundColor: '#2a2420', borderWidth: 1, borderColor: '#52453b' },
  updateButtonText: { color: '#161412', fontFamily: 'serif', fontSize: 13, fontWeight: 'bold', letterSpacing: 1 },
  updateButtonTextSaved: { color: '#e6dfd5' },
  deleteButton: { backgroundColor: '#3b2322', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  deleteButtonText: { color: '#e6a8a8', fontWeight: 'bold', fontSize: 13 },
});