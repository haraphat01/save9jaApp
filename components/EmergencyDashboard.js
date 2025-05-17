// EmergencyDashboard.js
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, FlatList, Alert, SafeAreaView, Platform, ScrollView } from 'react-native'; // Import Platform and ScrollView
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import { Linking } from 'react-native';
import { CircularProgress } from '@mui/material'; // Import web spinner (install with `npm install @mui/material @emotion/react @emotion/styled`)
import { baseUrl } from '../constant/constant'
import * as FileSystem from 'expo-file-system';
// Import sensor modules
import { Accelerometer } from 'expo-sensors';
import { Gyroscope, Barometer } from 'expo-sensors';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export default function EmergencyDashboard() {
  // Recording State and Functions
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);
  const intervalRef = useRef(null);
  const [hasContacts, setHasContacts] = useState(false);

  // Location State
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);

  // Battery State
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  // Network State
  const [networkInfo, setNetworkInfo] = useState(null);

  // Sensor states - Interpretations
  const [fallDetected, setFallDetected] = useState(false);
  const [altitudeChange, setAltitudeChange] = useState(null);
  const [impactDetected, setImpactDetected] = useState(false);

  // Raw sensor data
  const [accelerometerData, setAccelerometerData] = useState({});
  const [gyroscopeData, setGyroscopeData] = useState({});
  const [barometerData, setBarometerData] = useState(null);

  // Previous sensor values for change detection
  const [previousAltitude, setPreviousAltitude] = useState(null);

  // Constants
  const FALL_THRESHOLD = 20; // Adjust as needed
  const IMPACT_THRESHOLD = 25;
  const ALTITUDE_CHANGE_THRESHOLD = 5; //meters

  //Combined Emergency data
  const [emergencyData, setEmergencyData] = useState({
    location: null,
    address: null,
    batteryLevel: null,
    networkInfo: null,
    fallDetected: false,
    altitudeChange: null,
    impactDetected: false,
    recording: null // Changed from recordingUri to recording: null
  });

  // Load saved recordings on mount
  useEffect(() => {
    const getLocationAndBattery = async () => {
      await fetchLocation();
      await updateBatteryInfo();
      await getNetworkInfo();
    };

    getLocationAndBattery();
    const intervalId = setInterval(getLocationAndBattery, 60000);  //Update Location and Battery every minute
    return () => clearInterval(intervalId);
    setupSensors();
  }, []);

  useEffect(() => {
    // This effect will run whenever `isRecording` changes to false
    if (!isRecording && recordingRef.current) {
      const uri = recordingRef.current.getURI();
      sendEmergencyData(uri); //Send the data to the server
    }
  }, [isRecording]);

  const setupSensors = () => {
    const sensorInterval = 200;
    Accelerometer.setUpdateInterval(sensorInterval);
    Gyroscope.setUpdateInterval(sensorInterval);
    Barometer.setUpdateInterval(sensorInterval);

    Accelerometer.addListener(handleAccelerometerData);
    Gyroscope.addListener(handleGyroscopeData);
    Barometer.addListener(handleBarometerData);

    return () => {
      Accelerometer.removeAllListeners();
      Gyroscope.removeAllListeners();
      Barometer.removeAllListeners();
    };
  };

  const handleAccelerometerData = (data) => {
    setAccelerometerData(data);
    const combinedAcceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    if (combinedAcceleration > FALL_THRESHOLD) {
      setFallDetected(true);
      setTimeout(() => setFallDetected(false), 3000); // Reset after 3 seconds
    }
    if (combinedAcceleration > IMPACT_THRESHOLD) {
      setImpactDetected(true);
      setTimeout(() => setImpactDetected(false), 3000);
    }
  };

  const handleGyroscopeData = (data) => {
    setGyroscopeData(data);
  };

  const handleBarometerData = async (data) => {
    setBarometerData(data.pressure);
    const altitude = 44330 * (1 - Math.pow(data.pressure / 1013.25, 0.1903));
    if (previousAltitude !== null) {
      const change = altitude - previousAltitude;
      if (Math.abs(change) > ALTITUDE_CHANGE_THRESHOLD) {
        setAltitudeChange(change);
        setTimeout(() => setAltitudeChange(null), 5000);
      }
    }
    setPreviousAltitude(altitude);
  };

  // Check for contacts on component mount
  useEffect(() => {
    checkContacts();
  }, []);

  const checkContacts = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${baseUrl}/api/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setHasContacts(data.contacts && data.contacts.length > 0);
    } catch (error) {
      console.error('Error checking contacts:', error);
      setHasContacts(false);
    }
  };

  const startRecording = async () => {
    if (!hasContacts) {
      Alert.alert(
        'No Emergency Contacts',
        'Please add at least one emergency contact before using the emergency button.',
        [
          {
            text: 'Add Contact',
            onPress: () => navigation.navigate('Contacts'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    try {
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        Alert.alert('Permission required', 'Please grant access to the microphone');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      recordingRef.current = newRecording;
      setIsRecording(true);

      intervalRef.current = setInterval(async () => {
        await stopCurrentAndStartNewRecording();
      }, 60000);

    } catch (error) {
      console.error('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopCurrentAndStartNewRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        await sendEmergencyData(uri);

        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await newRecording.startAsync();
        recordingRef.current = newRecording;
      } catch (error) {
        console.error('Error in recording cycle', error);
      }
    }
  };

  const stopRecording = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        await sendEmergencyData(uri);
        recordingRef.current = null;
      }

      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  // Location fetching
  const fetchLocation = async () => {
    setLocationLoading(true);
    setLocationErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationErrorMsg('Permission to access location was denied');
        setLocationLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      fetchAddress(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      setLocationErrorMsg('Failed to fetch location');
      console.error("Location Error:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDnulN971D1d7iOzl_9NQcPUhTteiHzumg` // Replace with your API Key
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      setAddress('Failed to fetch address');
      console.error("Address Fetch Error:", error);
    }
  };

  // Battery monitoring functions
  const updateBatteryInfo = async () => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level);
    } catch (error) {
      console.error('Error fetching battery info:', error);
      setBatteryLevel(null);
    }
  };

  // Network Info
  const getNetworkInfo = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      setNetworkInfo(networkState);
    } catch (error) {
      console.error('Error fetching network info:', error);
      setNetworkInfo({ isConnected: false, isInternetReachable: false });
    }
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening settings:', error);
      alert('Could not open settings. Please check manually.');
    }
  };

  const getBatteryStateIcon = () => {
    if (batteryLevel > 0.75) return 'battery-full';
    if (batteryLevel > 0.5) return 'battery-half';
    if (batteryLevel > 0.2) return 'battery-quarter';
    return 'battery-dead';
  };

  const getBatteryColor = () => {
    if (batteryLevel <= 0.2) return '#FF3B30';
    if (batteryLevel <= 0.5) return '#FF9500';
    return '#4CD964';
  };

  // Function to send emergency data to the API
  const sendEmergencyData = async (recordingUri) => {
    // Fetch fresh data before sending
    await fetchLocation();
    await updateBatteryInfo();
    await getNetworkInfo();

    const authToken = await AsyncStorage.getItem('authToken');

    // Convert battery level to percentage
    const batteryPercentage = batteryLevel !== null ? (batteryLevel * 100).toFixed(0) : null;

    let base64Audio = null; // Variable to hold the Base64 audio data

    // Convert audio file to Base64
    if (recordingUri) {
      try {
        base64Audio = await FileSystem.readAsStringAsync(recordingUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("Successfully converted audio to base64");
      } catch (error) {
        console.error("Error converting audio to base64:", error);
        Alert.alert("Error", "Failed to convert audio to base64");
        base64Audio = null;  // Set to null to prevent sending incomplete data
      }
    }

    try {
      const data = {
        location: location,
        address: address,
        batteryLevel: batteryPercentage, // Send percentage here
        networkInfo: networkInfo,
        fallDetected: fallDetected,
        altitudeChange: altitudeChange,
        impactDetected: impactDetected,
        recording: base64Audio, // Send Base64 audio data here
      };

      //Set the emergency data state
      setEmergencyData(data);
      console.log("Sending Emergency Data:", data);

      const response = await fetch(`${baseUrl}/api/emergency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to send emergency data:', response.status, await response.text()); // Log response text for debugging
        Alert.alert("Error", "Failed to send emergency data. Status: " + response.status);
      } else {
        console.log('Emergency data sent successfully!');
        Alert.alert("Success", "Emergency data sent successfully!");
      }
    } catch (error) {
      console.error('Error sending emergency data:', error);
      Alert.alert("Error", "Error sending emergency data: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!hasContacts && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning-outline" size={24} color="#FF5252" />
            <Text style={styles.warningText}>
              Please add at least one emergency contact to use this feature
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.emergencyButton,
            isRecording && styles.emergencyButtonActive,
            !hasContacts && styles.emergencyButtonDisabled,
            styles.buttonShadow
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={!hasContacts}
        >
          <View style={styles.emergencyButtonInner}>
            <Text style={styles.emergencyText}>
              {isRecording ? 'Stop Emergency' : 'Tap Emergency'}
            </Text>
            <Ionicons 
              name={isRecording ? "stop-circle" : "alert-circle"} 
              size={32} 
              color="white" 
              style={styles.emergencyIcon}
            />
          </View>
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Location Section */}
          <View style={[styles.section, styles.cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="location-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.sectionTitle}>Location</Text>
              {locationErrorMsg === 'Permission to access location was denied' && (
                <TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
                  <Text style={styles.settingsText}>Enable Location</Text>
                </TouchableOpacity>
              )}
            </View>
            {locationLoading ? (
              Platform.OS === 'ios' || Platform.OS === 'android' ? (
                <ActivityIndicator size="small" color="#4CAF50" style={styles.loader} />
              ) : (
                <View style={styles.webLoader}>
                  <CircularProgress size={20} />
                </View>
              )
            ) : locationErrorMsg ? (
              <Text style={styles.errorText}>{locationErrorMsg}</Text>
            ) : address ? (
              <Text style={styles.locationText}>{address}</Text>
            ) : location ? (
              <Text style={styles.locationText}>{`Lat: ${location.latitude}, Lng: ${location.longitude}`}</Text>
            ) : (
              <Text style={styles.locationText}>Fetching location...</Text>
            )}
          </View>

          {/* Battery Section */}
          <View style={[styles.section, styles.cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={getBatteryStateIcon()} size={22} color={getBatteryColor()} />
              </View>
              <Text style={styles.sectionTitle}>Battery Status</Text>
            </View>
            <View style={styles.batteryInfo}>
              <Text style={[styles.batteryText, { color: getBatteryColor() }]}>
                {batteryLevel ? `${(batteryLevel * 100).toFixed(0)}%` : 'Unknown'}
              </Text>
              {estimatedTimeRemaining && (
                <Text style={styles.estimateText}>{estimatedTimeRemaining}</Text>
              )}
              {isLowPowerMode && (
                <View style={styles.lowPowerMode}>
                  <Ionicons name="flash" size={14} color="#FF9500" />
                  <Text style={styles.lowPowerText}>Low Power Mode</Text>
                </View>
              )}
            </View>
          </View>

          {/* Network Section */}
          <View style={[styles.section, styles.cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="wifi-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.sectionTitle}>Network</Text>
            </View>
            <View style={styles.networkInfo}>
              <View style={styles.networkItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={networkInfo?.isConnected ? "#4CAF50" : "#FF5252"} />
                <Text style={styles.networkText}>
                  Connection Status: {networkInfo?.isConnected ? 'Connected' : 'Not Connected'}
                </Text>
              </View>
              <View style={styles.networkItem}>
                <Ionicons name="globe-outline" size={16} color={networkInfo?.isInternetReachable ? "#4CAF50" : "#FF5252"} />
                <Text style={styles.networkText}>
                  Internet Reachable: {networkInfo?.isInternetReachable ? 'Yes' : 'No'}
                </Text>
              </View>
              {networkInfo?.type && (
                <View style={styles.networkItem}>
                  <Ionicons name="cellular-outline" size={16} color="#4CAF50" />
                  <Text style={styles.networkText}>Connection Type: {networkInfo?.type}</Text>
                </View>
              )}
              {networkInfo?.cellularGeneration && (
                <View style={styles.networkItem}>
                  <Ionicons name="speedometer-outline" size={16} color="#4CAF50" />
                  <Text style={styles.networkText}>Cellular Generation: {networkInfo?.cellularGeneration}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Sensor Data Sections (Interpretations) */}
          <View style={[styles.section, styles.cardShadow]}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="alert-outline" size={22} color="#4CAF50" />
              </View>
              <Text style={styles.sectionTitle}>Emergency Interpretations</Text>
            </View>
            <View style={styles.sensorInfo}>
              {fallDetected && (
                <View style={styles.alertItem}>
                  <Ionicons name="warning" size={16} color="#FF5252" />
                  <Text style={styles.alertText}>Possible Fall Detected!</Text>
                </View>
              )}
              {impactDetected && (
                <View style={styles.alertItem}>
                  <Ionicons name="warning" size={16} color="#FF5252" />
                  <Text style={styles.alertText}>Possible Impact Detected!</Text>
                </View>
              )}
              {altitudeChange !== null && (
                <View style={styles.alertItem}>
                  <Ionicons name="trending-up" size={16} color="#FF5252" />
                  <Text style={styles.alertText}>
                    Altitude Change: {altitudeChange > 0 ? 'Ascending' : 'Descending'} by {Math.abs(altitudeChange).toFixed(2)} meters
                  </Text>
                </View>
              )}
              {!(fallDetected || altitudeChange || impactDetected) && (
                <View style={styles.noAlertsContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.noAlertsText}>No alerts at this time</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  scrollContainer: {
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFE0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  warningText: {
    color: '#FF5252',
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  emergencyButton: {
    width: 180,
    height: 180,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 90,
    marginBottom: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emergencyButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonActive: {
    backgroundColor: '#FF5252',
  },
  emergencyButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  emergencyText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  emergencyIcon: {
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  loader: {
    marginLeft: 52,
  },
  webLoader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 52,
  },
  locationText: {
    marginLeft: 52,
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    marginLeft: 52,
    color: '#FF5252',
    fontSize: 15,
  },
  batteryInfo: {
    marginLeft: 52,
    marginTop: 4,
  },
  batteryText: {
    fontSize: 24,
    fontWeight: '600',
  },
  estimateText: {
    marginTop: 5,
    color: '#7f8c8d',
    fontSize: 15,
  },
  lowPowerMode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FFF9E6',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lowPowerText: {
    marginLeft: 5,
    color: '#FF9500',
    fontWeight: '500',
  },
  networkInfo: {
    marginLeft: 52,
  },
  networkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 15,
  },
  sensorInfo: {
    marginLeft: 52,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFF3F3',
    padding: 8,
    borderRadius: 8,
  },
  alertText: {
    color: '#FF5252',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  noAlertsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9F0',
    padding: 8,
    borderRadius: 8,
  },
  noAlertsText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  settingsButton: {
    backgroundColor: '#3498db',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  settingsText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
});