import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MainDrawerParamList } from '../../types';
import { useTheme } from '../../store/ThemeContext';
import { FONTS, SPACING } from '../../constants/theme';

const BottomBar: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<MainDrawerParamList>>();
  const { colors, theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const tabs = [
    {
      name: 'Flow',
      label: 'FLOW',
      icon: 'flash',
      iconOutline: 'flash-outline',
      route: 'MainTabs' as keyof MainDrawerParamList,
      params: { screen: 'Flow' },
    },
    {
      name: 'Decouvrir',
      label: 'DÉCOUVRIR',
      icon: 'compass',
      iconOutline: 'compass-outline',
      route: 'MainTabs' as keyof MainDrawerParamList,
      params: { screen: 'Decouvrir' },
    },
    {
      name: 'Progresser',
      label: 'PROGRESSER',
      icon: 'trending-up',
      iconOutline: 'trending-up-outline',
      route: 'MainTabs' as keyof MainDrawerParamList,
      params: { screen: 'Progresser' },
    },
    {
      name: 'Moi',
      label: 'MOI',
      icon: 'person',
      iconOutline: 'person-outline',
      route: 'MainTabs' as keyof MainDrawerParamList,
      params: { screen: 'Moi' },
    },
  ];

  const handleTabPress = (tab: typeof tabs[0]) => {
    navigation.navigate(tab.route, tab.params as any);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      ]}
    >
      {tabs.map((tab) => {
        // Determine if this tab is active based on current route
        const isActive = false; // We'll keep it simple for now
        const iconName = isActive ? tab.icon : tab.iconOutline;
        const color = isActive ? colors.primary : colors.textSecondary;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <Ionicons name={iconName as any} size={24} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default BottomBar;

