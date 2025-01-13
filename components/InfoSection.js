import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const tips = [
  "Always share your location with trusted contacts.",
  "Know your rights during police encounters.",
  "Stay calm and document any incidents thoroughly.",
];

export default function InfoSection() {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Safety Tips</Text>
      <View style={styles.tipContainer}>
        <TouchableOpacity onPress={prevTip}>
          <Ionicons name="chevron-back-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.tipText}>{tips[currentTip]}</Text>
        <TouchableOpacity onPress={nextTip}>
          <Ionicons name="chevron-forward-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.learnMoreButton}>
        <Text style={styles.learnMoreText}>Learn More</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.knowRightsButton}>
        <Text style={styles.knowRightsText}>Know Your Rights</Text>
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
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  learnMoreButton: {
    alignItems: 'center',
    marginBottom: 12,
  },
  learnMoreText: {
    color: '#007AFF',
  },
  knowRightsButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  knowRightsText: {
    fontWeight: 'bold',
  },
});

