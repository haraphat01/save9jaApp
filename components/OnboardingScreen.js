import React, { useState, useRef } from 'react';
import security from "../assets/security.jpg"
import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Image,
  Animated 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const slides = [
    {
      id: '1',
      title: 'Welcome to Safe9ja',
      text: 'Your personal safety companion that keeps you protected 24/7.',
      details: 'Join thousands of Nigerians who trust Safe9ja for their personal security.',
      image: require('../assets/security.jpg')
    },
    {
      id: '2',
      title: 'Quick Emergency Response',
      text: 'Send SOS alerts with just one tap to your trusted contacts and nearby security services.',
      details: 'Your emergency contacts will receive your real-time location and status updates.',
      image: require('../assets/police.jpg')
    },
    {
      id: '3',
      title: 'Community Safety Network',
      text: 'Stay informed about security incidents in your area and contribute to community safety.',
      details: 'Receive real-time alerts about incidents within your vicinity and safe routes.',
      image: require('../assets/community.jpg')
    },
    {
      id: '4',
      title: 'Trusted Contacts',
      text: 'Add family members and friends to your trusted circle for enhanced protection.',
      details: 'Your trusted contacts can track your journey and receive instant notifications.',
      image: require('../assets/trusted.jpg')
    },
    {
      id: '5',
      title: 'Privacy & Security',
      text: 'Your safety is our priority, with bank-grade encryption protecting your data.',
      details: 'Control what you share and who can see your location. Your data never leaves your control.',
      image: require('../assets/privacy.jpg')
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
      <Image
        source={ item.image }
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.text}</Text>
      <Text style={styles.details}>{item.details}</Text>
    </View>
  );

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: currentIndex === index ? '#006400' : '#90EE90' }
            ]}
          />
        ))}
      </View>
    );
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  // Add this function to handle potential scroll failures
  const onScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ 
        index: info.index, 
        animated: true 
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={onScrollToIndexFailed}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
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
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    color: '#006400',
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
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#006400',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#2E8B57',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  details: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 30,
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
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#006400',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OnboardingScreen;