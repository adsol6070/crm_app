import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen name="Home" component={Home} />
      <BottomTab.Screen name="Profile" component={Profile} />
    </BottomTab.Navigator>
  );
};

const DrawerNavigator = () => {
  return ( 
  <Drawer.Navigator screenOptions={{ drawerPosition: "right" }}>
    <Drawer.Screen name="Main" component={BottomTabNavigator} />
    <Drawer.Screen name="Settings" component={Home} />
  </Drawer.Navigator>
  );
};

const MainNavigator = () => {
  return ( 
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={BottomTabNavigator} />
    <Stack.Screen name="Drawer" component={DrawerNavigator} />
  </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
