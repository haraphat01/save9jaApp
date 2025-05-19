import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionCard = ({ title, description, price, period, features, isPopular, onPress, buttonText }) => (
  <TouchableOpacity 
    style={[styles.subscriptionCard, isPopular && styles.popularCard]} 
    onPress={onPress}
  >
    {isPopular && (
      <View style={styles.popularBadge}>
        <Text style={styles.popularText}>Most Popular</Text>
      </View>
    )}
    <Text style={styles.subscriptionTitle}>{title}</Text>
    <Text style={styles.subscriptionDescription}>{description}</Text>
    <Text style={styles.subscriptionPrice}>{price}</Text>
    <Text style={styles.subscriptionPeriod}>{period}</Text>
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureRow}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
    <TouchableOpacity style={styles.subscribeButton}>
      <Text style={styles.subscribeButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const Subscription = ({ navigation }) => {
  const [isYearly, setIsYearly] = useState(false);

  const subscriptionPlans = [
    {
      title: 'Premium',
      description: 'Enhanced safety features for individuals',
      price: isYearly ? '$53.89' : '$4.99',
      period: isYearly ? 'per year' : 'per month',
      features: [
        'Everything in Free, plus:',
        'Unlimited emergency contacts',
        'Priority emergency response',
        'Advanced location tracking',
        'Real-time location sharing',
        'Custom emergency messages',
        'Multiple device support',
        'Geofencing alerts',
        'Advanced shake detection',
        'Premium support',
        '2 device sessions'
      ],
      isPopular: true,
      buttonText: 'Upgrade Now'
    }
  ];

  const freeFeatures = [
    'Emergency alert sending',
    'Basic profile management',
    'Community safety alerts',
    'Basic safety tips and resources',
    'Standard response time',
    '1 emergency contact',
    '1 device session'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Subscription</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.freeSection}>
            <Text style={styles.sectionTitle}>Free Version</Text>
            <Text style={styles.sectionSubtitle}>Basic safety features for everyone</Text>
            <View style={styles.freeFeaturesContainer}>
              {freeFeatures.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Upgrade to Premium</Text>
          <Text style={styles.sectionSubtitle}>Get access to enhanced safety features</Text>

          <View style={styles.billingToggle}>
            <TouchableOpacity 
              style={[styles.toggleOption, !isYearly && styles.toggleOptionActive]}
              onPress={() => setIsYearly(false)}
            >
              <Text style={[styles.toggleText, !isYearly && styles.toggleTextActive]}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleOption, isYearly && styles.toggleOptionActive]}
              onPress={() => setIsYearly(true)}
            >
              <Text style={[styles.toggleText, isYearly && styles.toggleTextActive]}>Yearly</Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save 10%</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.subscriptionCardsContainer}>
            {subscriptionPlans.map((plan, index) => (
              <SubscriptionCard
                key={index}
                {...plan}
                onPress={() => console.log('Subscribe to:', plan.title)}
              />
            ))}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Premium Features</Text>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <Text style={styles.infoText}>Enhanced security with advanced features</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={24} color="#4CAF50" />
              <Text style={styles.infoText}>Real-time location tracking and sharing</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={24} color="#4CAF50" />
              <Text style={styles.infoText}>Unlimited emergency contacts</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
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
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 24,
  },
  subscriptionCardsContainer: {
    gap: 16,
  },
  subscriptionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  popularCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  subscriptionPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subscriptionPeriod: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 8,
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 12,
  },
  freeSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
  freeFeaturesContainer: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 24,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  toggleOptionActive: {
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
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  toggleTextActive: {
    color: '#2C3E50',
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default Subscription; 