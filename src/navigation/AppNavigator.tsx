import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigation from "./DrawerNavigation";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerNavigation} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
