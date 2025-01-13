import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { baseUrl } from '../constant/constant';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignUp = async () => {
    if (!email || !phone || !password || !firstName || !lastName) {
      alert('Please fill in all fields');
      return;
    }
  
    try {
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Sign-up successful! Please check your email to verify your account.');
        navigation.navigate('Login'); // Redirect to login or another relevant screen
      } else {
        alert(data.error || 'Sign-up failed');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };
  
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="green"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="green"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="green"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <PhoneInput
          defaultValue={phone}
          defaultCode="NG"
          layout="first"
          onChangeFormattedText={(text) => setPhone(text)}
          containerStyle={styles.phoneInputContainer}
          textContainerStyle={styles.phoneInputTextContainer}
          textInputStyle={styles.phoneInputText}
          placeholder="Phone"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="green"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="green"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    color: 'green',
  },
  phoneInputContainer: {
    width: '80%',
    height: 50,
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
  },
  phoneInputTextContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 40,
  },
  phoneInputText: {
    color: 'green',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    color: 'green',
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;