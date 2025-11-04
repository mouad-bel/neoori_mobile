import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../types';
import { COLORS } from '../constants/theme';

// Screens
import FlowScreen from '../screens/FlowScreen';
import JeuxScreen from '../screens/JeuxScreen';
import RoomsScreen from '../screens/RoomsScreen';
import CapsulesScreen from '../screens/CapsulesScreen';
import FormationsScreen from '../screens/FormationsScreen';
import OffresScreen from '../screens/OffresScreen';
import AboutScreen from '../screens/AboutScreen';

// Components
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';
import CustomHeader from '../components/navigation/CustomHeader';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Flow"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: COLORS.background,
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="Flow"
        component={FlowScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Jeux"
        component={JeuxScreen}
        options={{ headerShown: false }}
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

