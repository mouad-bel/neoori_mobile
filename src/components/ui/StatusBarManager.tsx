import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../store/ThemeContext';

const StatusBarManager = () => {
  const { theme } = useTheme();
  return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />;
};

export default StatusBarManager;
