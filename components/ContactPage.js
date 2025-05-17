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
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constant/constant';
import { Ionicons } from '@expo/vector-icons';

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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Emergency Contact</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter contact's name"
                  value={contact.name}
                  onChangeText={(text) => setContact({ ...contact, name: text })}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  value={contact.phone}
                  onChangeText={(text) => setContact({ ...contact, phone: text })}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  value={contact.email}
                  onChangeText={(text) => setContact({ ...contact, email: text })}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Relationship</Text>
              <TouchableOpacity 
                style={styles.relationshipButton}
                onPress={() => setShowRelationshipPicker(true)}
              >
                <Ionicons name="people-outline" size={20} color="#666" style={styles.inputIcon} />
                <Text style={[
                  styles.relationshipButtonText,
                  !contact.relationship && styles.placeholderText
                ]}>
                  {contact.relationship || "Select Relationship"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveContact}
          >
            <Ionicons name="save-outline" size={24} color="white" />
            <Text style={styles.saveButtonText}>Save Contact</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={showRelationshipPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowRelationshipPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerModal}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Select Relationship</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowRelationshipPicker(false)}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {relationships.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.pickerItem,
                    contact.relationship === item && styles.pickerItemSelected
                  ]}
                  onPress={() => {
                    setContact({ ...contact, relationship: item });
                    setShowRelationshipPicker(false);
                  }}
                >
                  <Text style={[
                    styles.pickerItemText,
                    contact.relationship === item && styles.pickerItemTextSelected
                  ]}>
                    {item}
                  </Text>
                  {contact.relationship === item && (
                    <Ionicons name="checkmark" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 20,
    backgroundColor: 'white',
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#2C3E50',
  },
  relationshipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    height: 48,
  },
  relationshipButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
  },
  placeholderText: {
    color: '#999',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
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
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  closeButton: {
    padding: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerItemSelected: {
    backgroundColor: '#F1F8E9',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  pickerItemTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default ContactPage;