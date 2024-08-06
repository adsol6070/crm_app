import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";  
import AuthNavigator from "./src/navigation/AuthNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <AuthNavigator />
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
