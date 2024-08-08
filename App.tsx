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

export default function App() {
  let [fontsLoaded] = useFonts({
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
  });

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <SafeAreaProvider>
          {/* <AuthNavigator /> */}
          <AppNavigator />
        </SafeAreaProvider>
      </NavigationContainer>
    );
  } else {
    return <Text>error</Text>;
  }
}
