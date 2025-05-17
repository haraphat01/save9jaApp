import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  React.useLayoutEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        navigation.replace('Home');
      } else {
        setIsLoading(false);
      }
    };
    checkAuthToken();
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={80} color="white" />
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.title}>Welcome to SafeAlert</Text>
            <Text style={styles.subtitle}>Your Safety, Our Priority</Text>
            <Text style={styles.description}>
              Join millions of users worldwide who trust SafeAlert for their personal security and peace of mind.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color="white" />
              <Text style={styles.featureText}>24/7 Emergency Response</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="location-outline" size={24} color="white" />
              <Text style={styles.featureText}>Real-time Location Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people-outline" size={24} color="white" />
              <Text style={styles.featureText}>Global Safety Network</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Onboarding')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  messageContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  button: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: Platform.OS === 'ios' ? 20 : 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default WelcomeScreen;
