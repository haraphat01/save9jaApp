import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const OtpVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params; // Safely access route.params

  if (!email) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Error: Email not provided. Please go back and try again.</Text>
      </SafeAreaView>
    );
  }

  const [otp, setOtp] = useState('');

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
        const response = await fetch(`${baseUrl}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Email verified successfully');
        navigation.navigate('Login'); // Navigate to login screen
      } else {
        Alert.alert('Error', data.error || 'Verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="green"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green', marginBottom: 20 },
  input: { width: '80%', borderColor: 'green', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10, color: 'green' },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'red', fontSize: 16 },
});

export default OtpVerificationScreen;
