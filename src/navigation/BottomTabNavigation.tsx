import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Dashboard/Home";
import Profile from "../screens/Profile/Profile";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import Chat from "../screens/Chat";

const BottomTab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "person"
            | "person-outline"
            | "chatbubble"
            | "chatbubble-outline"
            | undefined;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={styles.tabIcon}
            />
          );
        },
        tabBarActiveTintColor: theme.COLORS.black,
        tabBarInactiveTintColor: theme.COLORS.gray1,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 5,
          height: Platform.OS === "ios" ? 70 : 60,
          borderTopWidth: 0,
          backgroundColor: theme.COLORS.white,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: "Mulish_600SemiBold",
          marginBottom: 5,
        },
        headerShown: false,
        transitionSpec: {
          open: { animation: "timing", config: { duration: 300 } },
          close: { animation: "timing", config: { duration: 300 } },
        },
        tabBarButton: (props) => <TouchableOpacity {...props} />,
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{ title: "Home" }}
      />
      <BottomTab.Screen
        name="Chat"
        component={Chat}
        options={{ title: "Chat" }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    marginBottom: 0,
  },
});

export default BottomTabNavigation;
