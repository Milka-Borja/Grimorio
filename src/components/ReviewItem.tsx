import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import GrimorioAlert from './GrimorioAlert';

export default function ReviewItem({ item, editReview, deleteReview }: any) {
  const [reviewText, setReviewText] = useState(item.review || '');
  const [status, setStatus] = useState(item.status || 'Por leer');
  const [page, setPage] = useState(item.page?.toString() || '');
  const [rating, setRating] = useState(item.rating || 0);
  
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);

  useEffect(() => {
    setReviewText(item.review || '');
    setStatus(item.status || 'Por leer');
    setPage(item.page?.toString() || '');
    setRating(item.rating || 0);
  }, [item.review, item.status, item.page, item.rating]);

  const handleUpdate = () => {
    // Empaquetamos absolutamente todas las propiedades para que viajen juntas
    const updatedData = {
      ...item,
      bookTitle: item.bookTitle,
      review: reviewText,
      status: status,
      page: status === 'Leyendo' ? page : '',
      rating: status === 'Leído' ? rating : 0
    };

    editReview.mutate({ 
      id: item.id, 
      data: updatedData 
    });
    
    setEditModalVisible(false);
    setSuccessAlertVisible(true);
  };

  const handleCancelEdit = () => {
    setReviewText(item.review || '');
    setStatus(item.status || 'Por leer');
    setPage(item.page?.toString() || '');
    setRating(item.rating || 0);
    setEditModalVisible(false);
  };

  return (
    <View style={[styles.card, item.isPending && styles.cardPending]}>
      <GrimorioAlert 
        visible={isSuccessAlertVisible}
        title="Sello Alterado"
        message={`El registro de "${item.bookTitle}" ha sido guardado.`}
        onConfirm={() => setSuccessAlertVisible(false)}
        confirmText="Entendido"
      />

      <GrimorioAlert 
        visible={isDeleteAlertVisible}
        title="Eliminar registro"
        message={`¿Estás seguro de eliminar el registro de "${item.bookTitle}"?`}
        onConfirm={() => {
          setDeleteAlertVisible(false);
          deleteReview.mutate(item.id);
        }}
        onCancel={() => setDeleteAlertVisible(false)}
        confirmText="Eliminar"
        cancelText="Conservar"
        isDestructive={true}
      />

      {/* Modal de Edición Temático */}
      <Modal transparent visible={isEditModalVisible} animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle} numberOfLines={1}>{item.bookTitle}</Text>
            
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

            {status === 'Leyendo' && (
              <View style={styles.conditionalField}>
                <Text style={styles.fieldLabel}>Página actual:</Text>
                <TextInput
                  style={styles.smallInput}
                  value={page}
                  onChangeText={setPage}
                  placeholder="Ej: 145"
                  placeholderTextColor="#6a5d52"
                  keyboardType="numeric"
                />
              </View>
            )}

            {status === 'Leído' && (
              <View style={styles.conditionalField}>
                <Text style={styles.fieldLabel}>Valoración:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      <Text style={[styles.star, rating >= star ? styles.starFilled : styles.starEmpty]}>
                        {rating >= star ? '★' : '☆'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TextInput
              style={styles.input}
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Escribe tus notas aquí..."
              placeholderTextColor="#6a5d52"
              multiline
            />
            
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.cancelModalButton} onPress={handleCancelEdit}>
                <Text style={styles.cancelModalText}>Cerrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveModalButton} onPress={handleUpdate}>
                <Text style={styles.saveModalText}>Guardar Sello</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Tarjeta Principal */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.bookTitle} numberOfLines={2}>✦ {item.bookTitle}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.statusBadgeText}>[{item.status || 'Por leer'}]</Text>
              {item.status === 'Leyendo' && item.page ? (
                <Text style={styles.pageIndicator}> • Pág. {item.page}</Text>
              ) : null}
              {item.status === 'Leído' && item.rating > 0 ? (
                <Text style={styles.ratingIndicator}> • {'★'.repeat(item.rating)}</Text>
              ) : null}
            </View>
          </View>
          {item.isPending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>⏳ Pendiente</Text>
            </View>
          )}
        </View>

        {item.review ? (
          <Text style={styles.reviewPreview} numberOfLines={3}>
            "{item.review}"
          </Text>
        ) : (
          <Text style={styles.noReviewText}>Sin notas registradas en este tomo...</Text>
        )}
        
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
            <Text style={styles.editButtonText}>{item.review ? '✎ Editar' : '✎ Redactar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteAlertVisible(true)}>
            <Text style={styles.deleteButtonText}>✕ Quitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#201c19', padding: 16, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#362f2a', elevation: 2 },
  cardPending: { borderStyle: 'dashed', borderColor: '#c8a97e', opacity: 0.9 },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  titleRow: { flex: 1, marginRight: 10 },
  bookTitle: { fontSize: 16, fontFamily: 'serif', color: '#e6dfd5', fontWeight: 'bold', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  statusBadgeText: { fontSize: 11, color: '#c8a97e', fontFamily: 'serif', fontWeight: 'bold' },
  pageIndicator: { fontSize: 12, color: '#8c7b6d', fontFamily: 'serif', fontStyle: 'italic' },
  ratingIndicator: { fontSize: 13, color: '#c8a97e' },
  pendingBadge: { backgroundColor: '#523a1a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 2 },
  pendingText: { color: '#c8a97e', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  reviewPreview: { color: '#b5a899', fontSize: 13, fontFamily: 'serif', fontStyle: 'italic', marginBottom: 14, lineHeight: 18 },
  noReviewText: { color: '#52453b', fontSize: 12, fontFamily: 'serif', fontStyle: 'italic', marginBottom: 14 },

  cardActions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: '#2a2420', paddingTop: 10 },
  editButton: { backgroundColor: '#2a2420', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, borderWidth: 1, borderColor: '#52453b' },
  editButtonText: { color: '#c8a97e', fontFamily: 'serif', fontSize: 12, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#3b2322', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  deleteButtonText: { color: '#e6a8a8', fontSize: 12, fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(22, 20, 18, 0.85)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#201c19', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#c8a97e', elevation: 10 },
  modalTitle: { color: '#c8a97e', fontSize: 18, fontFamily: 'serif', fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  tagsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  tagButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#52453b', backgroundColor: '#1c1917' },
  tagButtonActive: { backgroundColor: '#c8a97e', borderColor: '#c8a97e' },
  tagText: { color: '#8c7b6d', fontSize: 12, fontFamily: 'serif' },
  tagTextActive: { color: '#161412', fontWeight: 'bold' },
  conditionalField: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16, gap: 10 },
  fieldLabel: { color: '#e6dfd5', fontFamily: 'serif', fontSize: 14 },
  smallInput: { backgroundColor: '#161412', color: '#e6dfd5', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#52453b', width: 80, textAlign: 'center' },
  starsContainer: { flexDirection: 'row', gap: 4 },
  star: { fontSize: 24, paddingHorizontal: 2 },
  starFilled: { color: '#c8a97e' },
  starEmpty: { color: '#52453b' },
  input: { backgroundColor: '#161412', color: '#e6dfd5', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#362f2a', height: 100, textAlignVertical: 'top', fontSize: 14, marginBottom: 20 },
  modalButtonRow: { flexDirection: 'row', gap: 12 },
  cancelModalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#52453b', backgroundColor: '#1c1917', alignItems: 'center' },
  cancelModalText: { color: '#8c7b6d', fontFamily: 'serif', fontWeight: 'bold' },
  saveModalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#c8a97e', alignItems: 'center' },
  saveModalText: { color: '#161412', fontFamily: 'serif', fontWeight: 'bold' },
});