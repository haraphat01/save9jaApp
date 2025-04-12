import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmergencyContactsModal from './modal/EmergencyContactsModal'; // Make sure path is correct

const Stack = createStackNavigator();

const ProfilePage = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigateTo('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Profile</Text>
       
        <TouchableOpacity style={styles.section} onPress={() => navigateTo('PersonalDetails')}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <Text style={styles.sectionDescription}>Manage your personal information</Text>
        </TouchableOpacity>
        
       
        
        <TouchableOpacity style={styles.section} onPress={() => navigateTo('Delete')}>
          <Text style={styles.sectionTitle}>Manage Contacts</Text>
          <Text style={styles.sectionDescription}>Manage emergency contacts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.section} onPress={() => navigateTo('AppPreferences')}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <Text style={styles.sectionDescription}>Customize your app settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.section} onPress={() => navigateTo('RecentReports')}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <Text style={styles.sectionDescription}>View your activity history</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.section} onPress={() => navigateTo('SecurityOptions')}>
          <Text style={styles.sectionTitle}>Security Options</Text>
          <Text style={styles.sectionDescription}>Manage your account security</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.section} onPress={() => navigateTo('About')}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionDescription}>View app information</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <EmergencyContactsModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    padding: 20,
    paddingBottom: 0,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionDescription: {
    color: '#666',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfilePage;