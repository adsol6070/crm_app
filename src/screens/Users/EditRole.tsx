import React, { useCallback, useEffect, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RadioButton, Checkbox } from "react-native-paper";
import Header1 from "../../components/Header1";
import { rolesService } from "../../api/roles";
import { components } from "../../components";
import { theme } from "../../constants/theme";

const schema = yup.object().shape({
  role: yup.string().required("Role Name is required"),
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

const EditRole = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roleName } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const roleDetail = await rolesService.getRoleByName({ role: roleName });
      setRoleID(roleDetail.id);

      if (roleDetail) {
        reset({ role: roleDetail.role });

        // Map API permissions to the state structure
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleDetails();
  }, [roleName]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRoleDetails();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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
      await rolesService.updateRole(formData, roleID);
      Alert.alert("Success", "Role updated successfully.");
      navigation.navigate("ViewRoles");
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "Failed to update the role.");
    }
  };

  const handlePermissionChange = (moduleId, permission) => {
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [moduleId]: {
        ...prevPermissions[moduleId],
        [permission]: !prevPermissions[moduleId]?.[permission],
      },
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title="Edit Role"
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
          name="role"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Role"
              placeholder="Enter role name"
              containerStyle={styles.inputContainer}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.role?.message}
            />
          )}
        />

        <Text style={styles.subTitle}>Select Module:</Text>
        <View style={styles.radioGroup}>
          {modules.map((module) => (
            <View key={module.id} style={styles.radioContainer}>
              <RadioButton
                value={module.id}
                status={selectedModule === module.id ? "checked" : "unchecked"}
                onPress={() => setSelectedModule(module.id)}
                color={theme.COLORS.black}
              />
              <Text style={styles.radioLabel}>{module.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.permissionsContainer}>
          <Text style={styles.subTitle}>Permissions:</Text>
          {modules
            .filter((module) => module.id === selectedModule)
            .map((module) => (
              <ScrollView
                key={module.id}
                style={styles.permissionsScrollView}
                contentContainerStyle={styles.permissionsGroup}
                showsVerticalScrollIndicator={false}
              >
                {module.permissions.length > 0 ? (
                  module.permissions.map((permission) => (
                    <View key={permission} style={styles.permissionContainer}>
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
                    </View>
                  ))
                ) : (
                  <Text style={styles.noPermissions}>
                    No permissions available
                  </Text>
                )}
              </ScrollView>
            ))}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.submitButtonText}>Edit</Text>
        </TouchableOpacity>
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
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 8,
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
  },
  permissionsContainer: {
    marginBottom: 20,
  },
  permissionsScrollView: {
    maxHeight: 200,
  },
  permissionsGroup: {
    backgroundColor: theme.COLORS.secondaryWhite,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    elevation: 1,
  },
  permissionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  permissionLabel: {
    marginLeft: 8,
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
  },
  noPermissions: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
  },
  submitButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: theme.COLORS.white,
    ...theme.FONTS.H4,
  },
});

export default EditRole;
