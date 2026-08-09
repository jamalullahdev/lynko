import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import ProjectsListScreen from '../screens/projects/ProjectsListScreen';
import ContactPMScreen from '../screens/contact/ContactPMScreen';
import ChainOfCustodyScreen from '../screens/coc/ChainOfCustodyScreen';
import SuppliesScreen from '../screens/supplies/SuppliesScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ChainOfCustody"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Projects"
        component={ProjectsListScreen}
        options={{
          tabBarLabel: 'Projects',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ContactPM"
        component={ContactPMScreen}
        options={{
          tabBarLabel: 'Contact PM',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ChainOfCustody"
        component={ChainOfCustodyScreen}
        options={{
          tabBarLabel: 'Chain of Custody',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="SampleMedia"
        component={SuppliesScreen}
        options={{
          tabBarLabel: 'Sample Media',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="beaker-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
