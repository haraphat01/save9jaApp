import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyAction() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="warning-outline" size={32} color="#fff" />
        <Text style={styles.buttonText}>Tap for Emergency Help</Text>
      </TouchableOpacity>
      <Text style={styles.description}>
        Sends an instant alert to your trusted contacts and authorities.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
});

