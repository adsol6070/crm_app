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

type RoleManagerRouteParams = {
  params?: {
    roleName?: string;
  };
};

const schema = yup.object().shape({
  role: yup
    .string()
    .required("Role Name is required")
    .min(2, "Role must be at least 2 characters")
    .max(30, "Role must be less than 30 characters")
    .matches(/^[a-z_]+$/, "Role name must be lowercase with underscores only."),
});

const modules = [
  {
    id: "users",
    name: "Users",
    permissions: ["Read", "Create", "Update", "Delete"],
  },
  {
    id: "blogs",
    name: "Blogs",
    permissions: ["Create", "Read", "Update", "Delete"],
  },
  {
    id: "leads",
    name: "Leads",
    permissions: [
      "AddNotes",
      "Assign",
      "Create",
      "Delete",
      "DeleteAll",
      "DeleteNote",
      "DeleteNotes",
      "DownloadCSV",
      "DownloadCSVFormat",
      "Edit",
      "EditNote",
      "History",
      "ImportBulk",
      "ReadQR",
      "Status",
      "View",
    ],
  },
  {
    id: "scores",
    name: "Scores",
    permissions: ["Create", "Read", "Delete", "DeleteAll"],
  },
  {
    id: "visaCategory",
    name: "VisaCategory",
    permissions: ["Create"],
  },
  {
    id: "reports",
    name: "Reports",
    permissions: ["view", "export"],
  },
];

const RoleManager = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RoleManagerRouteParams, "params">>();
  const { roleName } = route.params || {};
  const isEditMode = !!roleName;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [roleID, setRoleID] = useState<string>("");
  const [permissions, setPermissions] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchRoleDetails = async () => {
    try {
      const roleDetail = await rolesService.getRoleByName({ role: roleName });
      setRoleID(roleDetail.id);

      if (roleDetail) {
        reset({ role: roleDetail.role });

        const formattedPermissions = {};
        modules.forEach((module) => {
          formattedPermissions[module.id] = module.permissions.reduce(
            (acc, permission) => {
              const apiPermissionValue =
                roleDetail.permissions[module.name]?.[permission] || false;
              acc[permission] = apiPermissionValue;
              return acc;
            },
            {}
          );
        });

        setPermissions(formattedPermissions);
      }
    } catch (error) {
      console.error("Error fetching role details:", error);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchRoleDetails();
    }
  }, [isEditMode, roleName]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (isEditMode) {
      fetchRoleDetails();
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handlePermissionChange = (moduleId: string, permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [moduleId]: {
        ...prevPermissions[moduleId],
        [permission]: !prevPermissions[moduleId]?.[permission],
      },
    }));
  };

  const onSubmit = async (data) => {
    const formattedPermissions = {};
    modules.forEach((module) => {
      formattedPermissions[module.name] = module.permissions.reduce(
        (acc, permission) => {
          acc[permission] = !!permissions[module.id]?.[permission];
          return acc;
        },
        {}
      );
    });

    const formData = {
      ...data,
      permissions: formattedPermissions,
    };

    try {
      await rolesService[isEditMode ? "updateRole" : "createRole"](
        formData,
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
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {modules
              .filter((module) => module.id === selectedModule)
              .map((module) =>
                module.permissions.length > 0 ? (
                  module.permissions.map((permission) => (
                    <TouchableOpacity
                      key={permission}
                      style={styles.permissionContainer}
                      onPress={() =>
                        handlePermissionChange(module.id, permission)
                      }
                    >
                      <Checkbox
                        status={
                          permissions[module.id]?.[permission]
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() =>
                          handlePermissionChange(module.id, permission)
                        }
                        color={theme.COLORS.black}
                      />
                      <Text style={styles.permissionLabel}>
                        {permission.charAt(0).toUpperCase() +
                          permission.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text key="no-permissions" style={styles.noPermissions}>
                    No permissions available
                  </Text>
                )
              )}
          </ScrollView>
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
