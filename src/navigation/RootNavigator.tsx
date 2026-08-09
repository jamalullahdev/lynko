import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '../store/useAppStore';

import LoginScreen from '../screens/auth/LoginScreen';
import TwoFactorAuthScreen from '../screens/auth/TwoFactorAuthScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const is2FAVerified = useAppStore((state) => state.is2FAVerified);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated || !is2FAVerified ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuthScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
