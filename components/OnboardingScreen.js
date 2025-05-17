import React, { useState, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Image,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const slides = [
    {
      id: '1',
      title: 'Welcome to SafeAlert',
      text: 'Your personal safety companion that keeps you protected 24/7.',
      details: 'Join millions of users worldwide who trust SafeAlert for their personal security.',
      icon: 'shield-checkmark'
    },
    {
      id: '2',
      title: 'Quick Emergency Response',
      text: 'Send SOS alerts with just one tap to your trusted contacts and emergency services.',
      details: 'Your emergency contacts will receive your real-time location and status updates.',
      icon: 'alert-circle'
    },
    {
      id: '3',
      title: 'Global Safety Network',
      text: 'Stay informed about security incidents in your area and contribute to community safety.',
      details: 'Receive real-time alerts about incidents within your vicinity and safe routes.',
      icon: 'people'
    },
    {
      id: '4',
      title: 'Trusted Contacts',
      text: 'Add family members and friends to your trusted circle for enhanced protection.',
      details: 'Your trusted contacts can track your journey and receive instant notifications.',
      icon: 'person-add'
    },
    {
      id: '5',
      title: 'Privacy & Security',
      text: 'Your safety is our priority, with bank-grade encryption protecting your data.',
      details: 'Control what you share and who can see your location. Your data never leaves your control.',
      icon: 'lock-closed'
    }
  ];

  const goToNextSlide = () => {
    if (currentIndex === slides.length - 1) {
      navigation.navigate('Login');
    } else {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToIndex({
        index: nextIndex,
        animated: true
      });
      setCurrentIndex(nextIndex);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={80} color="#4CAF50" />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.text}</Text>
      <Text style={styles.details}>{item.details}</Text>
    </View>
  );

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, width);
    
    return (
      <View style={styles.dotContainer}>
        {slides.map((_, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });
          
          const scale = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [1, 1.2, 1],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity,
                  transform: [{ scale }]
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={goToNextSlide}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons 
            name={currentIndex === slides.length - 1 ? 'checkmark' : 'arrow-forward'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 1,
  },
  skipButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
  },
  skipText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    width: width,
    height: height * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
  },
  details: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
});

export default OnboardingScreen;