import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "../screens/auth/SignIn";
import SignUp from "../screens/auth/SignUp";
import ForgotPassword from "../screens/auth/ForgotPassword";
import NewPassword from "../screens/auth/NewPassword";
import ForgotPasswordSentEmail from "../screens/auth/ForgotPasswordSentEmail";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen
        name="ForgotPasswordSentEmail"
        component={ForgotPasswordSentEmail}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
