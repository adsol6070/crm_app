import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { components } from "../../components";
import * as yup from "yup";
import { RadioButton, Checkbox } from "react-native-paper";
import Header1 from "../../components/Header1";
import { rolesService } from "../../api/roles";
import { Alert } from "react-native";

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

const HandleAccess = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [permissions, setPermissions] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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
    await rolesService.createRole(formData);
    navigation.navigate("ViewRoles");
    Alert.alert("Success", "Role created successfully.");
    reset();
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
        title="Roles and Access"
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
          <Text style={styles.submitButtonText}>Submit</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 22,
    paddingBottom: 10,
    backgroundColor: theme.COLORS.white,
  },
  backButton: {
    flex: 1,
  },
  headerTitle: {
    ...theme.FONTS.H4,
    textAlign: "center",
    flex: 2,
  },
  headerSpacer: {
    flex: 1,
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
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: theme.COLORS.black,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    elevation: 2,
  },
  submitButtonText: {
    ...theme.FONTS.H5,
    color: theme.COLORS.white,
  },
});

export default HandleAccess;
