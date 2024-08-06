import { View, Text, Button } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../constants/theme";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

const SignIn = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <View>
        <Text>SignIn</Text>
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
