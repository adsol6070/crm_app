// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/MainNavigator';
import { Mulish_400Regular, Mulish_600SemiBold, Mulish_700Bold } from '@expo-google-fonts/mulish';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './src/common/context/AuthContext';
import { Provider as PaperProvider } from 'react-native-paper';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <PaperProvider>
          {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </PaperProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
