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
  SafeAreaView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constant/constant';

const ContactPage = ({ navigation }) => {
  const [contact, setContact] = useState({
    name: '',
    phone: '+234',
    email: '',
    relationship: '',
  });
  
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);
  
  const relationships = [
    'Family',
    'Friend',
    'Colleague',
    'Other'
  ];

  const validateContact = () => {
    return contact.name && contact.phone && contact.email && contact.relationship;
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
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      Alert.alert('Success', 'Emergency contact saved successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save contact. You already have 3 contacts');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Emergency Contact</Text>

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
            value={contact.phone}
            onChangeText={(text) => setContact({ ...contact, phone: text })}
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
          <TouchableOpacity 
            style={styles.dropdownButton} 
            onPress={() => setShowRelationshipPicker(true)}
          >
            <Text style={[
              styles.dropdownButtonText, 
              !contact.relationship && styles.placeholderText
            ]}>
              {contact.relationship || "Select Relationship"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveContact}>
          <Text style={styles.buttonText}>Save Contact</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Relationship Picker Modal */}
      <Modal
        visible={showRelationshipPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRelationshipPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Relationship</Text>
            
            {relationships.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.pickerItem}
                onPress={() => {
                  setContact({ ...contact, relationship: item });
                  setShowRelationshipPicker(false);
                }}
              >
                <Text style={[
                  styles.pickerItemText,
                  contact.relationship === item && styles.pickerItemSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRelationshipPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'green',
  },
  contactForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F8F8F8',
    color: '#333',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 10,
    backgroundColor: '#F8F8F8',
    marginBottom: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  pickerItemSelected: {
    color: 'green',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  cancelButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactPage;