import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LocationStatus() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Location</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={18} color="#007AFF" />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.locationInfo}>
        <Ionicons name="location-outline" size={18} color="#666" />
        <Text style={styles.locationText}>123 Main St, Anytown, ST 12345</Text>
      </View>
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>Emergency Status</Text>
        <Text style={styles.statusText}>No active alerts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
  },
  statusSection: {
    marginTop: 8,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    color: '#4CD964',
  },
});

