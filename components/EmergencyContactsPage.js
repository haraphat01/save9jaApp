import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function EmergencyContactsPage() {
  const [contacts, setContacts] = useState([
    { name: '', phoneNumber: '+234', email: '', relationship: '' },
  ]);

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', phoneNumber: '+234', email: '', relationship: '' }]);
    } else {
      Alert.alert('Limit Reached', 'You can only add up to three contacts.');
    }
  };

  const updateContact = (index, field, value) => {
    const updatedContacts = contacts.map((contact, i) => {
      if (i === index) {
        return { ...contact, [field]: value };
      }
      return contact;
    });
    setContacts(updatedContacts);
  };

  const saveContacts = () => {
    console.log('Saving contacts:', contacts);
    Alert.alert('Success', 'Emergency contacts saved successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Your Trusted Contacts</Text>
      <Text style={styles.description}>
        Notify family, friends, or anyone you trust in case of an emergency. Add their details below.
      </Text>

      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactForm}>
          <Text style={styles.label}>Contact Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact's name"
            value={contact.name}
            onChangeText={(text) => updateContact(index, 'name', text)}
          />
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={contact.phoneNumber}
            onChangeText={(text) => updateContact(index, 'phoneNumber', text)}
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            value={contact.email}
            onChangeText={(text) => updateContact(index, 'email', text)}
            keyboardType="email-address"
          />
          <Text style={styles.label}>Relationship</Text>
          <Picker
            selectedValue={contact.relationship}
            style={styles.picker}
            onValueChange={(itemValue) => updateContact(index, 'relationship', itemValue)}
          >
            <Picker.Item label="Select Relationship" value="" />
            <Picker.Item label="Family" value="Family" />
            <Picker.Item label="Friend" value="Friend" />
            <Picker.Item label="Colleague" value="Colleague" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      ))}

      {contacts.length < 3 && (
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.buttonText}>+ Add Another Contact</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={saveContacts}>
        <Text style={styles.buttonText}>Save Contacts</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    lineHeight: 22,
    textAlign: 'center',
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
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  saveButton: {
    backgroundColor: 'darkgreen',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
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
