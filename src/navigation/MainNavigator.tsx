import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../store/ThemeContext';
import { MainDrawerParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';

// Other screens that can be accessed via drawer
// Flow, Dashboard, Jeux, Profile are accessed via MainTabs (BottomTabNavigator)
import RoomsScreen from '../screens/RoomsScreen';
import CapsulesScreen from '../screens/CapsulesScreen';
import FormationsScreen from '../screens/FormationsScreen';
import OffresScreen from '../screens/OffresScreen';
import AboutScreen from '../screens/AboutScreen';
import RecompensesScreen from '../screens/RecompensesScreen';
import ParametresScreen from '../screens/ParametresScreen';
import AccessibilityDemoScreen from '../screens/AccessibilityDemoScreen';
import GameScreen from '../screens/GameScreen';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: false, // Disable swipe to open drawer
        gestureEnabled: false, // Disable gestures
        drawerPosition: 'left',
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="Rooms"
        component={RoomsScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Capsules"
        component={CapsulesScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Formations"
        component={FormationsScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Offres"
        component={OffresScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Recompenses"
        component={RecompensesScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Parametres"
        component={ParametresScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="AccessibilityDemo"
        component={AccessibilityDemoScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Game"
        component={GameScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator;

