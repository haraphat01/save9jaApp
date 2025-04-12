import React, { useState, useRef } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, Alert, View } from 'react-native';
import { baseUrl } from '../constant/constant';

const OtpVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  if (!email) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Error: Email not provided. Please go back and try again.</Text>
      </SafeAreaView>
    );
  }

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move to next input if value is entered
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    // Move to previous input on backspace if current input is empty
    if (event.nativeEvent.key === 'Backspace' && index > 0 && otpValues[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otpValues.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter all 6 digits of the OTP');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Email verified successfully');
        navigation.replace('Login');
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
      <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>
      
      <View style={styles.otpContainer}>
        {otpValues.map((value, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            style={styles.otpInput}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            keyboardType="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1.5,
    borderColor: 'green',
    borderRadius: 8,
    fontSize: 20,
    color: 'green',
    textAlign: 'center',
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default OtpVerificationScreen;