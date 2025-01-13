import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import EmergencyAction from './EmergencyAction';
import QuickAccess from './QuickAccess';
import LocationStatus from './LocationStatus';
import IncidentHistory from './IncidentHistory';
import InfoSection from './InfoSection';
import Footer from './Footer';

const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar style="auto" />
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome to Homepage</Text>
        <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
      </View>

      <View style={styles.emergencyContainer}>
        <TouchableOpacity style={styles.emergencyButton} onPress={() => navigation.navigate('Emergency')}>
          <Text style={styles.emergencyText}>Tap Emergency</Text>
        </TouchableOpacity>
      </View>

     

      <View style={styles.sectionContainer}>
        <LocationStatus />
      </View>

      <View style={styles.sectionContainer}>
        <IncidentHistory />
      </View>

      <View style={styles.sectionContainer}>
        <InfoSection />
      </View>
    </ScrollView>
    <Footer />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 30, // Added top padding for better spacing on mobile
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'green',
    marginTop: 8,
    textAlign: 'center',
  },
  emergencyContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  emergencyButton: {
    width: '90%',
    aspectRatio: 1,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emergencyText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});

export default WelcomeScreen;
