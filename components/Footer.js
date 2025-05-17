import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabItem = ({ label, icon, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        isActive && styles.activeIconContainer
      ]}>
        <Ionicons
          name={isActive ? icon.replace('-outline', '') : icon}
          size={24}
          color={isActive ? '#4CAF50' : '#666'}
        />
      </View>
      <Text style={[
        styles.tabLabel,
        isActive && styles.activeTabLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function Footer() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const tabs = [
    { label: 'Home', icon: 'home-outline', screen: 'Home' },
    { label: 'Report', icon: 'document-text-outline', screen: 'Report' },
    { label: 'Contacts', icon: 'people-outline', screen: 'Delete' },
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
    backgroundColor: 'white',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});