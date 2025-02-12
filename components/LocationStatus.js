import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Battery from 'expo-battery';
import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';
import { Linking } from 'react-native';

// Import sensor modules
import { Accelerometer } from 'expo-sensors';
import { Gyroscope } from 'expo-sensors';
import { Barometer } from 'expo-sensors';

export default function LocationStatus() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
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

  // Location fetching
  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      fetchAddress(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      setErrorMsg('Failed to fetch location');
      console.error("Location Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDnulN971D1d7iOzl_9NQcPUhTteiHzumg` //REPLACE WITH YOUR API KEY
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
      const state = await Battery.getBatteryStateAsync();
      const lowPowerMode = await Battery.isLowPowerModeEnabledAsync();

      setBatteryLevel(level);
      setBatteryState(state);
      setIsLowPowerMode(lowPowerMode);

      if (state === Battery.BatteryState.CHARGING) {
        const hoursToFull = ((1 - level) * 2).toFixed(1);
        setEstimatedTimeRemaining(`~${hoursToFull}h until full`);
      } else {
        const hoursRemaining = (level * 12).toFixed(1);
        setEstimatedTimeRemaining(`~${hoursRemaining}h remaining`);
      }
    } catch (error) {
      console.error('Error fetching battery info:', error);
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

  // Sensor Configuration
  const sensorInterval = 200; // Milliseconds

  useEffect(() => {
    // Accelerometer
    Accelerometer.setUpdateInterval(sensorInterval);
    const accelerometerSubscription = Accelerometer.addListener(data => {
      setAccelerometerData(data);

      // Fall Detection Logic
      const combinedAcceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
      if (combinedAcceleration > FALL_THRESHOLD) {
        setFallDetected(true);
        setTimeout(() => setFallDetected(false), 3000); // Reset after 3 seconds
      }
      if(combinedAcceleration > IMPACT_THRESHOLD){
        setImpactDetected(true);
        setTimeout(() => setImpactDetected(false), 3000);
      }
    });

    // Gyroscope
    Gyroscope.setUpdateInterval(sensorInterval);
    const gyroscopeSubscription = Gyroscope.addListener(data => {
      setGyroscopeData(data);
    });

    // Barometer
    Barometer.setUpdateInterval(sensorInterval);
    const barometerSubscription = Barometer.addListener(async data => {
      setBarometerData(data.pressure);

      // Convert pressure to altitude (approximate)
      const altitude = 44330 * (1 - Math.pow(data.pressure / 1013.25, 0.1903)); // Rough calculation
      if (previousAltitude !== null) {
        const change = altitude - previousAltitude;
        if (Math.abs(change) > ALTITUDE_CHANGE_THRESHOLD) {
          setAltitudeChange(change);
          setTimeout(() => setAltitudeChange(null), 5000); //Clear after 5 seconds
        }
      }
      setPreviousAltitude(altitude);
    });

    let batterySubscription;
    const subscribeToBattery = async () => {
      batterySubscription = Battery.addBatteryStateListener(({ batteryState }) => {
        updateBatteryInfo();
      });
    };

    subscribeToBattery();
    updateBatteryInfo();
    fetchLocation();
    getNetworkInfo();

    return () => {
      accelerometerSubscription.remove();
      gyroscopeSubscription.remove();
      barometerSubscription.remove();
      if (batterySubscription) {
        batterySubscription.remove();
      }
    };
  }, [previousAltitude]);

  const getBatteryStateIcon = () => {
    if (batteryState === Battery.BatteryState.CHARGING) {
      return 'battery-charging';
    }
    if (batteryLevel > 0.75) return 'battery-full';
    if (batteryLevel > 0.5) return 'battery-half';
    if (batteryLevel > 0.2) return 'battery-quarter';
    return 'battery-dead';
  };

  const getBatteryColor = () => {
    if (batteryState === Battery.BatteryState.CHARGING) return '#4CD964';
    if (batteryLevel <= 0.2) return '#FF3B30';
    if (batteryLevel <= 0.5) return '#FF9500';
    return '#4CD964';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Device Status</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            fetchLocation();
            updateBatteryInfo();
            getNetworkInfo();
          }}
          disabled={loading}
        >
          <Ionicons name="refresh-outline" size={18} color={loading ? '#ccc' : '#007AFF'} />
          <Text style={[styles.refreshText, loading && { color: '#ccc' }]}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.sectionTitle}>Location</Text>
          {errorMsg === 'Permission to access location was denied' && (
            <TouchableOpacity onPress={openSettings} style={styles.settingsButton}>
              <Text style={styles.settingsText}>Enable Location</Text>
            </TouchableOpacity>
          )}
        </View>
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" style={{ marginLeft: 8 }} />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : address ? (
          <Text style={styles.locationText}>{address}</Text>
        ) : location ? (
          <Text style={styles.locationText}>{`Lat: ${location.latitude}, Lng: ${location.longitude}`}</Text>
        ) : (
          <Text style={styles.locationText}>Fetching location...</Text>
        )}
      </View>

      {/* Battery Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name={getBatteryStateIcon()} size={18} color={getBatteryColor()} />
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
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="wifi-outline" size={18} color="#666" />
          <Text style={styles.sectionTitle}>Network</Text>
        </View>
        <View style={styles.networkInfo}>
          <Text>
            Connection Status: {networkInfo?.isConnected ? 'Connected' : 'Not Connected'}
          </Text>
          <Text>
            Internet Reachable: {networkInfo?.isInternetReachable ? 'Yes' : 'No'}
          </Text>
          {networkInfo?.type && <Text>Connection Type: {networkInfo?.type}</Text>}
          {networkInfo?.cellularGeneration && <Text>Cellular Generation: {networkInfo?.cellularGeneration}</Text>}
        </View>
      </View>

      {/* Sensor Data Sections (Interpretations) */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="alert-outline" size={18} color="#666" />
          <Text style={styles.sectionTitle}>Emergency Interpretations</Text>
        </View>
        <View style={styles.sensorInfo}>
          {fallDetected && <Text style={styles.alertText}>Possible Fall Detected!</Text>}
          {impactDetected && <Text style={styles.alertText}>Possible Impact Detected!</Text>}
          {altitudeChange !== null && (
            <Text style={styles.alertText}>
              Altitude Change: {altitudeChange > 0 ? 'Ascending' : 'Descending'} by {Math.abs(altitudeChange).toFixed(2)} meters
            </Text>
          )}
          {/* No alerts to display.  */}
          {!(fallDetected || altitudeChange || impactDetected) && (
                <Text>No alerts at this time.</Text>
            )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationText: {
    color: '#666',
    marginLeft: 26,
  },
  errorText: {
    marginLeft: 26,
    color: 'red',
  },
  batteryInfo: {
    marginLeft: 26,
  },
  batteryText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  estimateText: {
    color: '#666',
    marginTop: 4,
  },
  lowPowerMode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  lowPowerText: {
    color: '#FF9500',
    marginLeft: 4,
    fontSize: 12,
  },
  networkInfo: {
    marginLeft: 26,
  },
  sensorInfo: {
    marginLeft: 26,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  settingsText: {
    color: '#fff',
    fontSize: 12,
  },
  alertText: {
    color: 'red',
    fontWeight: 'bold',
  },
});