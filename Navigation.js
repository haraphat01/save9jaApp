import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import OtpVerificationScreen from './components/OtpScreen';
import ProfilePage from './components/ProfilePage'
import PersonalDetails from './components/PersonalDetails';
import IncidentHistory from './components/IncidentHistory';
import ManageContacts from './components/ManageContacts';
import ContactPage from './components/ContactPage';
import Subscription from './components/Subscription';

const Stack = createStackNavigator();
const queryClient = new QueryClient();

const Navigation = () => {
  return (
    <QueryClientProvider client={queryClient}>
    
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Otp" component={OtpVerificationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalDetails" component={PersonalDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Report" component={IncidentHistory} options={{ headerShown: false }} />
          <Stack.Screen name="Contacts" component={ContactPage} options={{ headerShown: false }} />
          <Stack.Screen name="Delete" component={ManageContacts} options={{ headerShown: false }} />
          <Stack.Screen name="Subscription" component={Subscription} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default Navigation;
