import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import { theme } from "../../../../constants/theme";
import RoleDetailSkeletonLoader from "./SkeletonLoader";
import Header1 from "../../../../components/Header1";
import { rolesService } from "../../../../api/roles";
import { formatRoleDisplayName } from "../../../../utils/FormatRoleDisplayName";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/AppNavigator";

type RoleDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RoleDetail"
>;
type RoleDetailRouteProp = RouteProp<RootStackParamList, "RoleDetail">;

const RoleDetail = () => {
  const navigation = useNavigation<RoleDetailNavigationProp>();
  const route = useRoute<RoleDetailRouteProp>();
  const { roleName } = route.params;
  const [roleDetails, setRoleDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchRoleDetails = async () => {
    setLoading(true);
    try {
      const roleDetail = await rolesService.getRoleByName({ role: roleName });
      setRoleDetails(roleDetail);
    } catch (error) {
      console.error("Error fetching role details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleDetails();
  }, [roleName]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRoleDetails();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      await rolesService.deleteRole(roleDetails.id);
      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this role?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                await rolesService.deleteRole(roleDetails.id);
                navigation.goBack();
                Alert.alert("Success", "Role deleted successfully");
              } catch (error) {
                Alert.alert("Error", "Failed to delete role");
                console.error("Error deleting role:", error);
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete role.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <RoleDetailSkeletonLoader isLoading={loading} />
      {!loading && roleDetails ? (
        <>
          <Header1
            title={formatRoleDisplayName(roleDetails.role)}
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
          />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.detailsContainer}>
              <Text style={styles.subTitle}>Permissions:</Text>
              {Object.keys(roleDetails.permissions).map((module) => (
                <View key={module} style={styles.moduleContainer}>
                  <Text style={styles.moduleTitle}>{module}</Text>
                  <View style={styles.permissionsContainer}>
                    {Object.keys(roleDetails.permissions[module]).map(
                      (permission) => (
                        <View key={permission} style={styles.permissionItem}>
                          <Checkbox
                            status={
                              roleDetails.permissions[module][permission]
                                ? "checked"
                                : "unchecked"
                            }
                            color={theme.COLORS.primary}
                            disabled
                          />
                          <Text style={styles.permissionText}>
                            {permission}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("RoleManager", { roleName })}
              >
                <AntDesign name="edit" size={24} color={theme.COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.deleteButton]}
                onPress={handleDeleteRole}
              >
                <MaterialIcons
                  name="delete"
                  size={24}
                  color={theme.COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      ) : (
        !loading && <Text style={styles.errorText}>No role details found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  detailsContainer: {
    marginBottom: 2,
  },
  subTitle: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
    marginBottom: 10,
  },
  moduleContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.COLORS.secondaryWhite,
  },
  moduleTitle: {
    ...theme.FONTS.H5,
    color: theme.COLORS.black,
    marginBottom: 5,
  },
  permissionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  permissionText: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 14,
    color: theme.COLORS.gray1,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: theme.COLORS.black,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },
  editButtonText: {
    ...theme.FONTS.H5,
    color: theme.COLORS.white,
  },
  deleteButton: {
    backgroundColor: "#B00020",
  },
  deleteButtonText: {
    ...theme.FONTS.H5,
    color: theme.COLORS.white,
  },
  buttonContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  errorText: {
    ...theme.FONTS.H4,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RoleDetail;
