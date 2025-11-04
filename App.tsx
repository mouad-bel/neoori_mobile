import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useColorScheme } from 'react-native';

// Providers
import { AuthProvider } from './src/store/AuthContext';
import { VideoProvider } from './src/store/VideoContext';
import { ThemeProvider } from './src/store/ThemeContext';

// Navigation
import RootNavigator from './src/navigation/RootNavigator';

// Theme
import { COLORS } from './src/constants/theme';
import { useTheme } from './src/store/ThemeContext';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <VideoProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <RootNavigator />
              </NavigationContainer>
            </VideoProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
