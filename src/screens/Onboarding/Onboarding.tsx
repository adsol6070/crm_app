import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { View, Text, Button } from "react-native";
import { RootStackParamList } from "../../types";
import { theme } from "../../constants/theme";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <View>
        <Text>Onboarding Screen</Text>
        <Button title="Sign In" onPress={() => navigation.navigate("SignIn")} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
