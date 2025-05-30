import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Plane, Bookmark, User } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary.main,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.background.primary,
          borderTopWidth: 1,
          borderTopColor: COLORS.border.light,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Regular',
          fontSize: 12,
          marginTop: -5,
        },
        headerStyle: {
          backgroundColor: COLORS.primary.main,
        },
        headerTintColor: COLORS.primary.contrast,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Flights',
          tabBarIcon: ({ color }) => <Plane size={24} color={color} />,
          headerTitle: 'Find Flights',
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'My Bookings',
          tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
          headerTitle: 'My Bookings',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}