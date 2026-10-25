import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  character: any;
  onPressAction: () => void;
}

export default function CharacterCard({ character, onPressAction }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.status}>
          {character.status === 'Alive' ? '🟢' : character.status === 'Dead' ? '🔴' : '⚪'} {character.status} - {character.species}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onPressAction}>
          <Text style={styles.buttonText}>Agregar amenaza</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#3c3e44', // Color temático oscuro
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 120,
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f5f5f5',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#22c55e', // Verde vibrante
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});