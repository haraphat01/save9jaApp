import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../../constant/constant';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyContactsModal({ visible, onClose }) {
  const [contact, setContact] = useState({
    name: '',
    phone: '+234',
    email: '',
    relationship: '',
  });

  const validateContact = () => {
    return contact.name && contact.phoneNumber && contact.email && contact.relationship;
  };

  const saveContact = async () => {
    if (!validateContact()) {
      Alert.alert('Validation Error', 'Please fill out all fields for the contact.');
      return;
    }

    const authToken = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`${baseUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(contact), // Send as array to maintain API compatibility
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      Alert.alert('Success', 'Emergency contact saved successfully!');
      onClose(); // Close modal after successful save
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save contact. You already have 3 contacts');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Add Emergency Contact</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.container}>
            <Text style={styles.description}>
              Add details of someone you trust to contact in case of an emergency.
            </Text>

            <View style={styles.contactForm}>
              <Text style={styles.label}>Contact Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter contact's name"
                value={contact.name}
                onChangeText={(text) => setContact({ ...contact, name: text })}
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={contact.phoneNumber}
                onChangeText={(text) => setContact({ ...contact, phoneNumber: text })}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                value={contact.email}
                onChangeText={(text) => setContact({ ...contact, email: text })}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Relationship</Text>
              <Picker
                selectedValue={contact.relationship}
                style={styles.picker}
                onValueChange={(itemValue) => 
                  setContact({ ...contact, relationship: itemValue })
                }
              >
                <Picker.Item label="Select Relationship" value="" />
                <Picker.Item label="Family" value="Family" />
                <Picker.Item label="Friend" value="Friend" />
                <Picker.Item label="Colleague" value="Colleague" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
              <Text style={styles.buttonText}>Save Contact</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // This makes the modal slide up from bottom
  },
  modalContent: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%', // Takes up 90% of screen height
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    lineHeight: 22,
  },
  contactForm: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#F7F7F7',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
  },
  saveButton: {
    backgroundColor: 'darkgreen',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});