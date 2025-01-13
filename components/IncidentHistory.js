import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const incidents = [
  { id: '1', date: 'Feb 28, 2024, 3:45 PM', type: 'SOS Alert', status: 'Resolved' },
  { id: '2', date: 'Feb 25, 2024, 1:20 PM', type: 'Police Brutality Report', status: 'Pending' },
];

export default function IncidentHistory() {
  const renderItem = ({ item }) => (
    <View style={styles.incidentItem}>
      <Text style={styles.incidentDate}>{item.date}</Text>
      <Text style={styles.incidentType}>{item.type}</Text>
      <Text style={styles.incidentStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <FlatList
        data={incidents}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View All</Text>
        <Ionicons name="chevron-forward-outline" size={16} color="#007AFF" />
      </TouchableOpacity>
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
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  incidentItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  incidentDate: {
    fontWeight: 'bold',
  },
  incidentType: {
    color: '#666',
    fontSize: 14,
  },
  incidentStatus: {
    color: '#666',
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  viewAllText: {
    color: '#007AFF',
    marginRight: 4,
  },
});

