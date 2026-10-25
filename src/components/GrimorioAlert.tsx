import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GrimorioAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function GrimorioAlert({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  isDestructive = false,
}: GrimorioAlertProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={styles.buttonRow}>
            {onCancel && (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.confirmButton, isDestructive && styles.destructiveButton]} 
              onPress={onConfirm}
            >
              <Text style={[styles.confirmText, isDestructive && styles.destructiveText]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 20, 18, 0.85)', // Fondo oscuro semitransparente
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertBox: {
    backgroundColor: '#201c19', // Color madera oscura de tus tarjetas
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#c8a97e', // Borde dorado
    elevation: 10,
  },
  title: {
    color: '#c8a97e',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    color: '#e6dfd5',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#52453b',
    backgroundColor: '#1c1917',
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    color: '#8c7b6d',
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#c8a97e',
    flex: 1,
    alignItems: 'center',
  },
  confirmText: {
    color: '#161412',
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  destructiveButton: {
    backgroundColor: '#3b2322', // Rojo oscuro para eliminar
    borderWidth: 1,
    borderColor: '#e6a8a8',
  },
  destructiveText: {
    color: '#e6a8a8',
  },
});