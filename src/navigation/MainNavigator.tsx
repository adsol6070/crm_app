import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => {
  <Drawer.Navigator>
    <Drawer.Screen name="" component={} />
    <Drawer.Screen name="" component={} />
  </Drawer.Navigator>;
};

const BottomTabNavigator = () => {
  <BottomTab.Navigator>
    <BottomTab.Screen name="Home" component={} />
    <BottomTab.Screen name="Profile" component={} />
  </BottomTab.Navigator>;
};

const MainNavigator = () => {
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={BottomTabNavigator} />
    <Stack.Screen name="Drawer" component={DrawerNavigator} />
  </Stack.Navigator>;
};

export default MainNavigator;
