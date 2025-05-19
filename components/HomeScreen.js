import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocationStatus from './LocationStatus';
import EmergencyButton from './EmmergencyButton';
import EmergencyDashboard from './EmergencyDashboard';
import Footer from './Footer';

const WelcomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top + 16, 30),
              minHeight: screenHeight - insets.bottom - 80, // Account for footer height
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Welcome to SafeAlert</Text>
              <Text style={styles.title}>Your Personal Safety Guardian</Text>
              <Text style={styles.subtitle}>
                Stay protected with real-time emergency alerts, instant access to help, and 24/7 safety monitoring
              </Text>
            </View>

            {/* Main Dashboard */}
            <View style={styles.dashboardContainer}>
              <EmergencyDashboard navigation={navigation} />
            </View>

            {/* Additional Safety Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Quick Actions</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.tipText}>
                    • Tap the emergency button for immediate assistance
                  </Text>
                  <Text style={styles.tipText}>
                    • Shake your phone to trigger emergency alert
                  </Text>
                  <Text style={styles.tipText}>
                    • View your safety status and location tracking
                  </Text>
                  <Text style={styles.tipText}>
                    • Access your emergency contacts quickly
                  </Text>
                  <Text style={styles.tipText}>
                    • Check your recent safety alerts
                  </Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Safety Tips</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.tipText}>
                    • Keep your emergency contacts updated and verified
                  </Text>
                  <Text style={styles.tipText}>
                    • Enable location services for accurate emergency response
                  </Text>
                  <Text style={styles.tipText}>
                    • Test your emergency alert system monthly
                  </Text>
                  <Text style={styles.tipText}>
                    • Share your live location with trusted contacts
                  </Text>
                  <Text style={styles.tipText}>
                    • Keep your medical information updated
                  </Text>
                  <Text style={styles.tipText}>
                    • Set up custom emergency messages
                  </Text>
                  <Text style={styles.tipText}>
                    • Review your safety settings regularly
                  </Text>
                </View>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureTitle}>Emergency Preparedness</Text>
                <View style={styles.featureContent}>
                  <Text style={styles.tipText}>
                    • Know your nearest emergency services
                  </Text>
                  <Text style={styles.tipText}>
                    • Keep your phone charged and location on
                  </Text>
                  <Text style={styles.tipText}>
                    • Update your safety preferences
                  </Text>
                  <Text style={styles.tipText}>
                    • Review emergency contact response times
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <Footer />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  dashboardContainer: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  featureContent: {
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default WelcomeScreen;