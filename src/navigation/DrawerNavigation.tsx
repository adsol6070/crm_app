import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import BottomTabNavigation from "./BottomTabNavigation";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import DrawerItemWithSubItems from "./DrawerItemWithSubItems";
import { userService } from "../api/user";
import { useAuth } from "../common/context/AuthContext";
import SkeletonLoader from "./ProfileSkeletonLoader";
import { IUserProfile } from "../types";
import { usePermissions } from "../common/context/PermissionContext";
import { hasPermission } from "../utils/HasPermission";
import { formatRoleDisplayName } from "../utils/FormatRoleDisplayName";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const { user } = useAuth();
  const { permissions, refreshPermissions } = usePermissions();
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [profileFetched, setProfileFetched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const isDrawerOpen = useDrawerStatus() === "open";

  useEffect(() => {
    if (isDrawerOpen && !profileFetched) {
      fetchProfile();
      refreshPermissions();
    }
  }, [isDrawerOpen, profileFetched]);

  const fetchProfile = async () => {
    if (!user?.sub) return;
    setLoading(true);
    try {
      const response = await userService.getProfile({ userId: user?.sub });
      const { firstname, lastname, profileImageUrl, role } = response;
      setUserProfile({ firstname, lastname, profileImageUrl, role });
      setProfileFetched(true);
    } catch (error) {
      console.log("Profile Fetching error ", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProfile = () => {
    if (loading) return <SkeletonLoader />;
    return (
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              userProfile?.profileImageUrl ||
              "https://avatar.iran.liara.run/public/boy",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>
          {userProfile?.firstname} {userProfile?.lastname}
        </Text>
        <Text style={styles.profileRole}>
          {formatRoleDisplayName(userProfile?.role || "")}
        </Text>
      </View>
    );
  };

  const drawerItems = [
    {
      label: "Users",
      icon: "people-outline",
      requiredPermission: { section: "Users", action: "Read" },
      subItems: [
        {
          label: "Add Users",
          screen: "UserManager",
          requiredPermission: { section: "Users", action: "Create" },
        },
        {
          label: "View Users",
          screen: "ViewUsers",
          requiredPermission: { section: "Users", action: "Read" },
        },
        {
          label: "Roles and Permissions",
          screen: "RoleManager",
          requiredPermission: { section: "Roles", action: "Update" },
        },
        {
          label: "View Roles",
          screen: "ViewRoles",
          requiredPermission: { section: "Roles", action: "Read" },
        },
      ],
    },
    {
      label: "Leads",
      icon: "people-outline",
      requiredPermission: { section: "Leads", action: "View" },
      subItems: [
        {
          label: "Add Lead",
          screen: "AddLead",
          requiredPermission: { section: "Leads", action: "Create" },
        },
        {
          label: "FormQR",
          screen: "Formqr",
          requiredPermission: { section: "Leads", action: "ReadQR" },
        },
        {
          label: "List Leads",
          screen: "ListLeads",
          requiredPermission: { section: "Leads", action: "View" },
        },
        {
          label: "Add Category",
          screen: "AddVisaCategory",
          requiredPermission: { section: "VisaCategory", action: "Create" },
        },
        {
          label: "Add Checklists",
          screen: "AddChecklist",
          requiredPermission: { section: "Checklists", action: "Create" },
        },
        {
          label: "View Checklists",
          screen: "ViewChecklist",
          requiredPermission: { section: "Checklists", action: "Read" },
        },
      ],
    },
    {
      label: "Blogs",
      icon: "book-outline",
      requiredPermission: { section: "Blogs", action: "Read" },
      subItems: [
        {
          label: "Add Blog",
          screen: "AddBlog",
          requiredPermission: { section: "Blogs", action: "Create" },
        },
        {
          label: "Add Category",
          screen: "AddBlogCategory",
          requiredPermission: { section: "BlogCategory", action: "Create" },
        },
        {
          label: "List Blogs",
          screen: "ListBlogs",
          requiredPermission: { section: "Blogs", action: "Read" },
        },
      ],
    },
    {
      label: "Scores",
      icon: "calculator",
      requiredPermission: { section: "Scores", action: "Read" },
      subItems: [
        {
          label: "Calculate CRS",
          screen: "Calculatecrs",
          requiredPermission: { section: "Scores", action: "Read" },
        },
        {
          label: "View Results",
          screen: "ScoreList",
          requiredPermission: { section: "Scores", action: "Read" },
        },
      ],
    },
  ];

  const renderDrawerItems = () => {
    return drawerItems.map((item, index) => {
      if (["Roles and Permissions", "View Roles"].includes(item.label)) {
        if (user?.role !== "super_admin") {
          return null;
        }
      }

      if (
        !hasPermission(
          permissions,
          item.requiredPermission.section,
          item.requiredPermission.action
        )
      ) {
        return null;
      }
      return (
        <DrawerItemWithSubItems
          key={index}
          label={item.label}
          icon={item.icon}
          subItems={item.subItems.filter((subItem) =>
            hasPermission(
              permissions,
              subItem.requiredPermission.section,
              subItem.requiredPermission.action
            )
          )}
        />
      );
    });
  };

  return (
    <SafeAreaView style={styles.drawerContent}>
      {renderProfile()}
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <DrawerItemList {...props} />
        {renderDrawerItems()}
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
        name="DrawerHome"
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
});

export default DrawerNavigation;
