import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.tab}>
        <Ionicons name="home" size={24} color="#2e7d32" />
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Ionicons name="document-text-outline" size={24} color="#4caf50" />
        <Text style={[styles.tabText, styles.inactiveText]}>Report</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Ionicons name="people-outline" size={24} color="#4caf50" />
        <Text style={[styles.tabText, styles.inactiveText]}>Contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab}>
        <Ionicons name="person-outline" size={24} color="#4caf50" />
        <Text style={[styles.tabText, styles.inactiveText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e8e0',
    backgroundColor: '#ffffff',
    paddingBottom: 20, // Add safe area for iPhone home indicator
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tab: {
    alignItems: 'center',
    padding: 8,
    minWidth: 64,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    color: '#2e7d32', // Active tab text color
  },
  inactiveText: {
    color: '#4caf50', // Inactive tab text color
    fontWeight: '400',
  }
});