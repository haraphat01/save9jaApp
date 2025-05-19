import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EmergencyContactsModal from './modal/EmergencyContactsModal';
import { Ionicons } from '@expo/vector-icons';
import Footer from './Footer';

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

  const menuItems = [
    {
      title: 'Subscription',
      description: 'Upgrade to premium features',
      icon: 'star-outline',
      screen: 'Subscription',
      color: '#FFD700'
    },
    {
      title: 'Personal Details',
      description: 'Manage your personal information',
      icon: 'person-outline',
      screen: 'PersonalDetails',
      color: '#4CAF50'
    },
    {
      title: 'Manage Contacts',
      description: 'Manage emergency contacts',
      icon: 'people-outline',
      screen: 'Delete',
      color: '#2196F3'
    },
    {
      title: 'App Preferences',
      description: 'Customize your app settings',
      icon: 'settings-outline',
      screen: 'AppPreferences',
      color: '#9C27B0'
    },
    {
      title: 'Recent Reports',
      description: 'View your activity history',
      icon: 'document-text-outline',
      screen: 'RecentReports',
      color: '#FF9800'
    },
    {
      title: 'Security Options',
      description: 'Manage your account security',
      icon: 'shield-checkmark-outline',
      screen: 'SecurityOptions',
      color: '#F44336'
    },
    {
      title: 'About',
      description: 'View app information',
      icon: 'information-circle-outline',
      screen: 'About',
      color: '#607D8B'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => navigateTo('PersonalDetails')}
            >
              <Ionicons name="create-outline" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigateTo(item.screen)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF5252" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>

        <EmergencyContactsModal 
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  editButton: {
    padding: 8,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3F3',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  logoutButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfilePage;