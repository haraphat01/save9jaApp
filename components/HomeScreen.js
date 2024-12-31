import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.messageContainer}>
      <Text style={styles.title}>Welcome to Save9ja</Text>
      <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
      <Text style={styles.buttonText}>Get Started</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  messageContainer: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  subtitle: { fontSize: 16, color: 'green', marginTop: 10 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default WelcomeScreen;
