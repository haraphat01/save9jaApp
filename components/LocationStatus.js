import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function LocationStatus() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

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

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      fetchAddress(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      setErrorMsg('Failed to fetch location');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      setAddress('Failed to fetch address');
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Current Location</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchLocation} disabled={loading}>
          <Ionicons name="refresh-outline" size={18} color={loading ? '#ccc' : '#007AFF'} />
          <Text style={[styles.refreshText, loading && { color: '#ccc' }]}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.locationInfo}>
        <Ionicons name="location-outline" size={18} color="#666" />
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
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>Emergency Status</Text>
        <Text style={styles.statusText}>No active alerts</Text>
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
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    marginLeft: 8,
    color: '#666',
  },
  errorText: {
    marginLeft: 8,
    color: 'red',
  },
  statusSection: {
    marginTop: 8,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    color: '#4CD964',
  },
});
