import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox, RadioButton } from "react-native-paper";
import Header1 from "../../../../components/Header1";
import { components } from "../../../../components";
import { theme } from "../../../../constants/theme";
import { rolesService } from "../../../../api/roles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/AppNavigator";
import { Module, PermissionState, RoleFormData } from "./RoleManager.types";

const validationSchema = yup.object().shape({
  role: yup
    .string()
    .required("Role Name is required")
    .min(2, "Role must be at least 2 characters")
    .max(30, "Role must be less than 30 characters")
    .matches(/^[a-z_]+$/, "Role name must be lowercase with underscores only."),
});

const modules: Module[] = [
  {
    id: "users",
    name: "Users",
    permissions: [
      { name: "Read" },
      { name: "Create" },
      { name: "Update", dependsOn: "Read" },
      { name: "Delete", dependsOn: "Read" },
    ],
  },
  {
    id: "blogs",
    name: "Blogs",
    permissions: [
      { name: "Create" },
      { name: "Read" },
      { name: "Update" },
      { name: "Delete" },
    ],
  },
  {
    id: "leads",
    name: "Leads",
    permissions: [
      { name: "AddNotes" },
      { name: "Assign", dependsOn: "View" },
      { name: "Create" },
      { name: "Delete", dependsOn: "View" },
      {
        name: "DeleteAll",
        dependsOn: "Delete",
      },
      { name: "DeleteNote" },
      { name: "DeleteNotes" },
      { name: "DownloadCSV" },
      { name: "DownloadCSVFormat" },
      { name: "Edit", dependsOn: "View" },
      { name: "EditNote" },
      { name: "History", dependsOn: "View" },
      { name: "ImportBulk" },
      { name: "ReadQR" },
      { name: "Status", dependsOn: "View" },
      { name: "View" },
      { name: "Checklist", dependsOn: "View" },
      { name: "DeleteSelected", dependsOn: "View" },
    ],
  },
  {
    id: "scores",
    name: "Scores",
    permissions: [
      { name: "Create" },
      { name: "Read" },
      { name: "Delete" },
      {
        name: "DeleteAll",
        dependsOn: "Delete",
      },
    ],
  },
  {
    id: "visaCategory",
    name: "VisaCategory",
    permissions: [{ name: "Create" }],
  },
  {
    id: "reports",
    name: "Reports",
    permissions: [{ name: "View" }, { name: "Export", dependsOn: "View" }],
  },
  {
    id: "checklists",
    name: "Checklists",
    permissions: [
      { name: "Create" },
      { name: "Read" },
      { name: "AddDocument", dependsOn: "Read" },
      { name: "EditDocument", dependsOn: "Read" },
      { name: "DeleteDocument", dependsOn: "Read" },
      { name: "DeleteChecklist", dependsOn: "Read" },
      { name: "Update", dependsOn: "Read" },
    ],
  },
];

type RoleManagerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RoleManager"
>;
type RoleManagerRouteProp = RouteProp<RootStackParamList, "RoleManager">;

// Utility function to format permissions for submission
const formatPermissionsForSubmission = (
  modules: Module[],
  permissions: PermissionState
) => {
  return modules.reduce((formattedPermissions, module) => {
    formattedPermissions[module.name] = module.permissions.reduce(
      (acc, permission) => {
        acc[permission.name] = !!permissions[module.id]?.[permission.name];
        return acc;
      },
      {} as Record<string, boolean>
    );
    return formattedPermissions;
  }, {} as Record<string, Record<string, boolean>>);
};

// Format fetched permissions into the required state format
const formatFetchedPermissions = (rolePermissions: Record<string, any>) => {
  return modules.reduce((acc, module) => {
    acc[module.id] = module.permissions.reduce((permAcc, perm) => {
      permAcc[perm.name] = rolePermissions[module.name]?.[perm.name] || false;
      return permAcc;
    }, {} as Record<string, boolean>);
    return acc;
  }, {} as PermissionState);
};

// Utility function to check for permission dependencies
const checkPermissionDependencies = (
  moduleId: string,
  permissionName: string,
  permissions: PermissionState,
  modules: Module[]
) => {
  const module = modules.find((mod) => mod.id === moduleId);
  const permission = module?.permissions.find(
    (perm) => perm.name === permissionName
  );
  if (permission?.dependsOn && !permissions[moduleId]?.[permission.dependsOn]) {
    Alert.alert(
      "Permission Dependency",
      `The "${permissionName}" permission depends on the "${permission.dependsOn}" permission. Please select it first.`
    );
    return false;
  }
  return true;
};

const RoleManager: React.FC = () => {
  const navigation = useNavigation<RoleManagerNavigationProp>();
  const route = useRoute<RoleManagerRouteProp>();
  const { roleName } = route.params || {};
  const isEditMode = !!roleName;

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [roleID, setRoleID] = useState<string>("");
  const [permissions, setPermissions] = useState<PermissionState>({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormData>({
    resolver: yupResolver(validationSchema),
  });

  // Fetch role details on initial load
  useEffect(() => {
    if (isEditMode) fetchRoleDetails(roleName);
  }, [isEditMode, roleName]);

  // Fetch role details from the server
  const fetchRoleDetails = async (roleName: string) => {
    try {
      const roleDetail = await rolesService.getRoleByName({ role: roleName });
      setRoleID(roleDetail.id);
      reset({ role: roleDetail.role });
      setPermissions(formatFetchedPermissions(roleDetail.permissions));
    } catch (error) {
      console.error("Error fetching role details:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (isEditMode) {
      fetchRoleDetails(roleName);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Handle permission change
  const handlePermissionChange = (moduleId: string, permissionName: string) => {
    if (
      !checkPermissionDependencies(
        moduleId,
        permissionName,
        permissions,
        modules
      )
    ) {
      return;
    }

    setPermissions((prevPermissions) => {
      const newPermissions = {
        ...prevPermissions,
        [moduleId]: {
          ...prevPermissions[moduleId],
          [permissionName]: !prevPermissions[moduleId]?.[permissionName],
        },
      };

      if (!newPermissions[moduleId][permissionName]) {
        modules
          .find((mod) => mod.id === moduleId)
          ?.permissions.forEach((perm) => {
            if (perm.dependsOn === permissionName) {
              newPermissions[moduleId][perm.name] = false;
            }
          });
      }

      return newPermissions;
    });
  };

  const onSubmit = async (data: RoleFormData) => {
    const formattedPermissions = formatPermissionsForSubmission(
      modules,
      permissions
    );

    try {
      await rolesService[isEditMode ? "updateRole" : "createRole"](
        { ...data, permissions: formattedPermissions },
        isEditMode ? roleID : undefined
      );
      Alert.alert(
        "Success",
        `Role ${isEditMode ? "updated" : "created"} successfully.`
      );
      navigation.navigate("ViewRoles");
    } catch (error) {
      Alert.alert(
        "Error",
        `An error occurred while ${
          isEditMode ? "updating" : "creating"
        } the role.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title={isEditMode ? "Edit Role" : "Add Role"}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Role"
              placeholder="e.g. admin, technical_staff"
              containerStyle={{ marginBottom: 20 }}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.role?.message}
            />
          )}
        />
        <Text style={styles.subTitle}>Select Module:</Text>
        <View style={styles.radioGroup}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.radioContainer}
              onPress={() => setSelectedModule(module.id)}
            >
              <RadioButton
                value={module.id}
                status={selectedModule === module.id ? "checked" : "unchecked"}
                onPress={() => setSelectedModule(module.id)}
                color={theme.COLORS.black}
              />
              <Text style={styles.radioLabel}>{module.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.permissionsContainer}>
          <View style={styles.permissionsHeader}>
            <Text style={styles.permissionsHeaderText}>Permissions:</Text>
          </View>
          {modules
            .filter((module) => module.id === selectedModule)
            .map((module) =>
              module.permissions.length > 0 ? (
                module.permissions.map((permission) => (
                  <TouchableOpacity
                    key={permission.name}
                    style={styles.permissionContainer}
                    onPress={() =>
                      handlePermissionChange(module.id, permission.name)
                    }
                  >
                    <Checkbox
                      status={
                        permissions[module.id]?.[permission.name]
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() =>
                        handlePermissionChange(module.id, permission.name)
                      }
                      color={theme.COLORS.black}
                    />
                    <Text style={styles.permissionLabel}>
                      {permission.name.charAt(0).toUpperCase() +
                        permission.name.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text key="no-permissions" style={styles.noPermissions}>
                  No permissions available
                </Text>
              )
            )}
        </View>

        <components.Button
          title={isEditMode ? "Edit" : "Submit"}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
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
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  subTitle: {
    ...theme.FONTS.H5,
    color: theme.COLORS.gray1,
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
    justifyContent: "space-between",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: theme.COLORS.secondaryWhite,
    borderRadius: 12,
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
    width: "48%",
  },
  radioLabel: {
    fontSize: 14,
    ...theme.FONTS.Mulish_600SemiBold,
    color: theme.COLORS.gray1,
  },
  permissionsContainer: {
    marginBottom: 25,
    backgroundColor: theme.COLORS.secondaryWhite,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionsHeader: {
    backgroundColor: theme.COLORS.black,
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
  },
  permissionsHeaderText: {
    fontSize: 18,
    ...theme.FONTS.Mulish_600SemiBold,
    color: theme.COLORS.white,
    textAlign: "center",
  },
  permissionsScrollView: {
    maxHeight: 250,
    marginTop: 10,
  },
  permissionsGroup: {
    borderRadius: 12,
    backgroundColor: theme.COLORS.transparent,
  },
  permissionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  permissionLabel: {
    marginLeft: 8,
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 16,
    color: theme.COLORS.gray1,
  },
  noPermissions: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
    textAlign: "center",
  },
});

export default RoleManager;
