import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PersonalDetails = ({ details = {}, onEdit }) => {
  const {
    fullName = 'John Doe',
    phoneNumber = '123-456-7890',
    email = 'example@example.com',
    address = '123 Main Street, Hometown, Country',
  } = details;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Details</Text>
      <Text>Full Name: {fullName}</Text>
      <Text>Phone Number: {phoneNumber}</Text>
      <Text>Email: {email}</Text>
      <Text>Address: {address}</Text>
      <TouchableOpacity style={styles.button} onPress={onEdit}>
        <Text style={styles.buttonText}>Edit Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default PersonalDetails;
