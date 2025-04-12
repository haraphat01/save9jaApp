import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  React.useLayoutEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        navigation.replace('Home'); // Use `replace` to avoid navigation stack issues
      } else {
        setIsLoading(false); // Token doesn't exist, stop loading and show the welcome screen
      }
    };
    checkAuthToken();
  }, [navigation]);

  if (isLoading) {
    // Show a loading indicator while checking the token
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.title}>Welcome to Safe9ja</Text>
        <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  messageContainer: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  subtitle: { fontSize: 16, color: 'green', marginTop: 10 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default WelcomeScreen;
