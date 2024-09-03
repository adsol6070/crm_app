import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { components } from "../../components";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const schema = yup.object().shape({
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Lastname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
  phone: yup.string().required("Phone number is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  role: yup.string().required("Role is required"),
});

const AddUser = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log("Data:", data);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reset({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      address: "",
      role: "",
    });
    setRefreshing(false);
  }, [reset]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flex: 1 }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={theme.COLORS.black}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ ...theme.FONTS.H4 }}>Add User</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
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
                  title="Password"
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
              name="country"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Country"
                  placeholder="Enter country"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.country?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="State"
                  placeholder="Enter state"
                  containerStyle={{ marginBottom: 20 }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={errors.state?.message}
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
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Role"
                  placeholder="Select role"
                  containerStyle={{ marginBottom: 20 }}
                  dropdown={true}
                  items={[
                    { label: "Admin", value: "admin" },
                    { label: "User", value: "user" },
                  ]}
                  selectedValue={value}
                  onValueChange={(val) => onChange(val)}
                  onBlur={onBlur}
                  error={errors.role?.message}
                />
              )}
            />
            <components.Button
              title="Create User"
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

export default AddUser;
