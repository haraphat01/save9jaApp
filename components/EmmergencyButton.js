import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, FlatList, Alert, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function EmergencyButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const recordingRef = useRef(null);
  const intervalRef = useRef(null);
  const soundRef = useRef(null);

  useEffect(() => {
    loadSavedRecordings();
  }, []);

  const loadSavedRecordings = async () => {
    try {
      const savedRecordings = await AsyncStorage.getItem('emergency-recordings');
      if (savedRecordings) {
        setRecordings(JSON.parse(savedRecordings));
      }
    } catch (error) {
      console.error('Failed to load recordings', error);
    }
  };

  const startRecording = async () => {
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
      }, 120000);

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
        const timestamp = new Date().toISOString();

        const newRecordings = [...recordings, { uri, timestamp }];
        setRecordings(newRecordings);
        await AsyncStorage.setItem('emergency-recordings', JSON.stringify(newRecordings));

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
        const timestamp = new Date().toISOString();

        const newRecordings = [...recordings, { uri, timestamp }];
        setRecordings(newRecordings);
        await AsyncStorage.setItem('emergency-recordings', JSON.stringify(newRecordings));

        recordingRef.current = null;
      }

      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const togglePlayback = async (uri) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        if (currentlyPlaying === uri) {
          setCurrentlyPlaying(null);
          return;
        }
      }

      const sound = new Audio.Sound();
      await sound.loadAsync({ uri });

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setCurrentlyPlaying(null);
          soundRef.current = null;
        }
      });

      soundRef.current = sound;
      setCurrentlyPlaying(uri);
      await sound.playAsync();

    } catch (error) {
      console.error('Failed to toggle playback', error);
      Alert.alert('Error', 'Failed to play recording');
    }
  };

  const deleteRecording = async (timestamp) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setCurrentlyPlaying(null);
      }

      const newRecordings = recordings.filter(rec => rec.timestamp !== timestamp);
      setRecordings(newRecordings);
      await AsyncStorage.setItem('emergency-recordings', JSON.stringify(newRecordings));
    } catch (error) {
      console.error('Failed to delete recording', error);
      Alert.alert('Error', 'Failed to delete recording');
    }
  };

  const confirmDelete = (timestamp) => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => deleteRecording(timestamp),
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.emergencyButton,
            isRecording && styles.emergencyButtonActive
          ]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.emergencyText}>
            {isRecording ? 'Stop Emergency' : 'Tap Emergency'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.recordingsTitle}>Recent Recordings</Text>

        <FlatList
          data={recordings}
          keyExtractor={(item) => item.timestamp}
          renderItem={({ item }) => (
            <View style={styles.recordingItem}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => togglePlayback(item.uri)}
              >
                <Ionicons
                  name={currentlyPlaying === item.uri ? "stop-circle-outline" : "play-circle-outline"}
                  size={24}
                  color="green"
                />
              </TouchableOpacity>
              <Text style={styles.recordingTimestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.timestamp)}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContentContainer} // Add contentContainerStyle
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  emergencyButton: {
    width: 180,
    height: 180,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 90,
    marginBottom: 20, // Add margin below the button
  },
  emergencyButtonActive: {
    backgroundColor: 'red',
  },
  emergencyText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
    textAlign: 'center',
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  playButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  flatListContentContainer: { // Style for contentContainerStyle
    flexGrow: 1,          // Ensure it can grow to fill the space
    justifyContent: 'flex-start', // Align items at the top
    width: '100%',       // Take full width
  },
});