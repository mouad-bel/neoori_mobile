import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Providers
import { AuthProvider } from './src/store/AuthContext';
import { VideoProvider } from './src/store/VideoContext';
import { ThemeProvider } from './src/store/ThemeContext';

// Navigation
import RootNavigator from './src/navigation/RootNavigator';

// Components
import StatusBarManager from './src/components/ui/StatusBarManager';

// Nous ne pouvons pas utiliser useTheme ici car il doit être utilisé à l'intérieur du ThemeProvider
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <VideoProvider>
              <NavigationContainer>
                <StatusBarManager />
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
