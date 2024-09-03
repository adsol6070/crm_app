// App.tsx

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  Mulish_400Regular,
  Mulish_600SemiBold,
  Mulish_700Bold,
} from "@expo-google-fonts/mulish";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import { AuthProvider, useAuth } from "./src/common/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import SocketManager from "./src/socket";
import { SocketProvider, useSocket } from "./src/common/context/SocketContext";

const AppContent = () => {
  const { isAuthenticated, token } = useAuth();
  const socketManager = useSocket(); // Use socket instance

  useEffect(() => {
    if (isAuthenticated && token) {
      socketManager.updateToken(token);
      socketManager.connectSocket();

      socketManager.on("welcome", (message) => {
        console.log("Welcome message:", message);
      });
    } else {
      socketManager.disconnectSocket();
    }

    return () => {
      socketManager.disconnectSocket();
    };
  }, [isAuthenticated, token]);

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
      <ActionSheetProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </ActionSheetProvider>
    </AuthProvider>
  );
}
