import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constant/constant';
import { Ionicons } from '@expo/vector-icons';

const fetchProfile = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('User token not found.');

  const response = await fetch(`${baseUrl}/api/personal`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch profile');
  const data = await response.json();
  return data.user;
};

const PersonalDetails = ({ navigation }) => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>Failed to load profile</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#4CAF50" />
            </View>
          </View>
          <Text style={styles.userName}>{profile.firstName} {profile.lastName}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF5015' }]}>
              <Ionicons name="person-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>First Name</Text>
              <Text style={styles.detailValue}>{profile.firstName}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF5015' }]}>
              <Ionicons name="person-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Last Name</Text>
              <Text style={styles.detailValue}>{profile.lastName}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#2196F315' }]}>
              <Ionicons name="mail-outline" size={24} color="#2196F3" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{profile.email}</Text>
              {profile.emailVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#FF980015' }]}>
              <Ionicons name="call-outline" size={24} color="#FF9800" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{profile.phone}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#9C27B015' }]}>
              <Ionicons name="calendar-outline" size={24} color="#9C27B0" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF5015' }]}>
              <Ionicons name="card-outline" size={24} color="#4CAF50" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Subscription Status</Text>
              <Text style={styles.detailValue}>
                {profile.subscription_status ? 
                  profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1) :
                  'Not Set'}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.iconContainer, { backgroundColor: '#2196F315' }]}>
              <Ionicons name="star-outline" size={24} color="#2196F3" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Subscription Type</Text>
              <Text style={styles.detailValue}>
                {profile.subscription_type ? 
                  profile.subscription_type.charAt(0).toUpperCase() + profile.subscription_type.slice(1) :
                  'Not Set'}
              </Text>
            </View>
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
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
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  detailsSection: {
    padding: 20,
  },
  detailItem: {
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
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
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
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PersonalDetails;
