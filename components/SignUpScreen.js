import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignUpScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Log In</Text>
    <TextInput style={styles.input} placeholder="Email or Phone" placeholderTextColor="green" />
    <TextInput style={styles.input} placeholder="Password" placeholderTextColor="green" secureTextEntry />
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
      <Text style={styles.buttonText}>Log In</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
      <Text style={styles.link}>Don’t have an account? Sign Up</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'green', marginBottom: 20 },
  input: { width: '80%', borderColor: 'green', borderWidth: 1, borderRadius: 10, padding: 10, marginVertical: 10, color: 'green' },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { color: 'green', marginTop: 20, fontSize: 14, textDecorationLine: 'underline' },
});

export default SignUpScreen
