import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Settings from "../screens/Settings";
import BottomTabNavigation from "./BottomTabNavigation";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import DrawerItemWithSubItems from "./DrawerItemWithSubItems";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  return (
    <SafeAreaView style={styles.drawerContent}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileRole}>Software Developer</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <DrawerItemList {...props} />
        <DrawerItemWithSubItems
          label="Blogs"
          icon="book-outline"
          subItems={[
            { label: "Add Blog", screen: "AddBlog" },
            { label: "List Blogs", screen: "ListBlogs" },
          ]}
        />
        <DrawerItemWithSubItems
          label="Leads"
          icon="people-outline"
          subItems={[
            { label: "Add Lead", screen: "AddLead" },
            { label: "List Leads", screen: "ListLeads" },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: "left",
        drawerStyle: { backgroundColor: theme.COLORS.white, width: 250 },
        headerShown: false,
        headerTintColor: theme.COLORS.black,
        drawerLabelStyle: {
          color: theme.COLORS.black,
          marginLeft: -10,
          fontFamily: "Mulish_400Regular",
        },
        drawerItemStyle: {
          marginVertical: 5,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: "Home",
          drawerIcon: () => (
            <Ionicons
              name="home-outline"
              size={24}
              color={theme.COLORS.black}
            />
          ),
        }}
        component={BottomTabNavigation}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          drawerLabel: "Settings",
          drawerIcon: () => (
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.COLORS.black}
            />
          ),
        }}
        component={Settings}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  profileSection: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    marginBottom: 6,
    fontFamily: "Mulish_700Bold",
    color: "#333",
  },
  profileRole: {
    marginBottom: 6,
    fontFamily: "Mulish_400Regular",
    color: "#666",
  },
  menuSection: {
    flex: 1,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 15,
    fontFamily: "Mulish_400Regular",
    fontSize: 16,
    color: theme.COLORS.black,
  },
  submenuSection: {
    marginTop: 20,
  },
  submenuTitle: {
    fontSize: 16,
    fontFamily: "Mulish_700Bold",
    color: theme.COLORS.black,
    marginBottom: 10,
  },
  submenuItem: {
    paddingVertical: 8,
  },
  submenuText: {
    fontFamily: "Mulish_400Regular",
    fontSize: 14,
    color: theme.COLORS.black,
  },
});

export default DrawerNavigation;
