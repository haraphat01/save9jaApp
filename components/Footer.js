import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabItem = ({ label, icon, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, isActive && styles.activeTab]}
    onPress={onPress}
    activeOpacity={0.7}>
    <View style={styles.iconContainer}>
      <Ionicons
        name={isActive ? icon.replace('-outline', '') : icon}
        size={24}
        color={isActive ? '#2E7D32' : '#4CAF50'}
        style={styles.icon}
      />
      {isActive && <View style={styles.activeDot} />}
    </View>
    <Text style={[styles.tabText, isActive && styles.activeText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function Footer() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const tabs = [
    { label: 'Home', icon: 'home-outline', screen: 'Home' },
    { label: 'Report', icon: 'document-text-outline', screen: 'Report' },
    { label: 'Contacts', icon: 'people-outline', screen: 'Contacts' },
    { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
  ];

  const getCurrentTab = () => {
    return route.name;
  };

  return (
    <View style={[
      styles.footer,
      { paddingBottom: Math.max(insets.bottom, 16) }
    ]}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.screen}
          label={tab.label}
          icon={tab.icon}
          isActive={getCurrentTab() === tab.screen}
          onPress={() => {
            if (getCurrentTab() !== tab.screen) {
              navigation.navigate(tab.screen);
            }
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E8E0',
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 32,
    marginBottom: 4,
    position: 'relative',
  },
  icon: {
    marginBottom: 2,
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2E7D32',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
    marginTop: 2,
  },
  activeText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
});