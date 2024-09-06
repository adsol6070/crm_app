import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { components } from "../../components";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { userService } from "../../api/user";
import Header1 from "../../components/Header1";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";
import { rolesService } from "../../api/roles";

const schema = yup.object().shape({
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Lastname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  role: yup.string().required("Role is required"),
});

const toTitleCase = (str: string) => {
  return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
};

const EditUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const [roleOptions, setRoleOptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchUser = async () => {
    try {
      const response = await userService.getUser(userId);
      reset({
        firstname: response.firstname,
        lastname: response.lastname,
        email: response.email,
        phone: response.phone,
        city: response.city,
        address: response.address,
        role: response.role,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchRoles = async () => {
    const roles = await rolesService.getAllRoles();
    const transformedRoles = roles.map((role: string) => toTitleCase(role));
    setRoleOptions([...transformedRoles] as any);
  };

  useEffect(() => {
    fetchRoles();
    fetchUser();
  }, [userId]);

  const onSubmit = async (data: any) => {
    try {
      // Create a new data object excluding empty password
      const updatedData = { ...data };
      if (!data.password) {
        delete updatedData.password; // Remove password field if empty
      }

      // Send the request with JSON data
      await userService.updateUser(updatedData, userId);
      Alert.alert("Success", "User edited successfully.");
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "An error occurred while updating the user.");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser();
    setRefreshing(false);
  }, [reset]);

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title="Edit User"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="firstname"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Firstname"
                  placeholder="Enter firstname"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.firstname?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="lastname"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Lastname"
                  placeholder="Enter lastname"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.lastname?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Email"
                  placeholder="example@mail.com"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="New Password"
                  placeholder="••••••••"
                  containerStyle={{ marginBottom: 20 }}
                  eyeOffSvg={true}
                  secureTextEntry={true}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Phone Number"
                  placeholder="Enter phone number"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="City"
                  placeholder="Enter city"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.city?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Address"
                  placeholder="Enter address"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.address?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
                <components.Dropdown
                  options={roleOptions}
                  selectedValue={capitalizeFirstLetter(value)}
                  onSelect={(value: string) => {
                    const val = value.toLowerCase();
                    onChange(val);
                  }}
                  placeholder="Select a role"
                  label="Role"
                  error={errors.role?.message}
                />
              )}
            />
            <components.Button
              title="Edit User"
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </KeyboardAwareScrollView>
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
    backgroundColor: theme.COLORS.white,
    paddingBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    marginVertical: 22,
    marginHorizontal: 22,
  },
});

export default EditUser;
