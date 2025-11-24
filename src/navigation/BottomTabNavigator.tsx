import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../store/ThemeContext';
import { FONTS } from '../constants/theme';

// Screens
import FlowScreen from '../screens/FlowScreen';
import JeuxScreen from '../screens/JeuxScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type BottomTabParamList = {
  Flow: undefined;
  Decouvrir: undefined;
  Progresser: undefined;
  Moi: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary, // Orange color
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Flow') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Decouvrir') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Progresser') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Moi') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Flow"
        component={FlowScreen}
        options={{
          tabBarLabel: 'FLOW',
        }}
      />
      <Tab.Screen
        name="Decouvrir"
        component={JeuxScreen}
        options={{
          tabBarLabel: 'DÉCOUVRIR',
        }}
      />
      <Tab.Screen
        name="Progresser"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'PROGRESSER',
        }}
      />
      <Tab.Screen
        name="Moi"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'MOI',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

