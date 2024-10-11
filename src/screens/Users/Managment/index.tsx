import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  RefreshControl,
  View,
  StyleSheet,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { userService } from "../../../api/user";
import { prepareFormData } from "../../../utils/prepareFormData";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { rolesService } from "../../../api/roles";
import { components } from "../../../components";
import { theme } from "../../../constants/theme";
import { formatRoleDisplayName } from "../../../utils/FormatRoleDisplayName";
import Header1 from "../../../components/Header1";

interface ImageObject {
  uri: string;
  name: string;
  type: string;
  size: number;
}

type UserData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  role: string;
};

type UserManagerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserManager"
>;
type UserManagerRouteProp = RouteProp<RootStackParamList, "UserManager">;

const schema = (isEditMode: boolean) =>
  yup.object().shape({
    firstname: isEditMode
      ? yup.string().nullable()
      : yup.string().required("Firstname is required"),
    lastname: isEditMode
      ? yup.string().nullable()
      : yup.string().required("Lastname is required"),
    email: isEditMode
      ? yup.string().nullable()
      : yup.string().email("Invalid email").required("Email is required"),
    phone: isEditMode
      ? yup.string().nullable()
      : yup.string().required("Phone number is required"),
    city: isEditMode
      ? yup.string().nullable()
      : yup.string().required("City is required"),
    address: isEditMode
      ? yup.string().nullable()
      : yup.string().required("Address is required"),
    role: isEditMode
      ? yup.string().nullable()
      : yup.string().required("Role is required"),
    password: isEditMode
      ? yup.string().nullable()
      : yup
          .string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
  });

const UserManager = () => {
  const navigation = useNavigation<UserManagerNavigationProp>();
  const route = useRoute<UserManagerRouteProp>();
  const { userId } = route.params || {};
  const isEditMode = !!userId;

  const [initialData, setInitialData] = useState<Partial<UserData> | null>(
    null
  );
  const [image, setImage] = useState<ImageObject | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [countryCode, setCountryCode] = useState<string>("+91");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema(isEditMode)),
  });

  const handleImageSelect = (image: any) =>
    setImage({
      uri: image.uri,
      name: image.fileName || "unknown",
      type: image.mimeType || "image/jpeg",
      size: image.fileSize || 0,
    });

  useEffect(() => {
    if (isEditMode && userId) {
      const fetchUser = async () => {
        try {
          const user = await userService.getUser(userId);
          const [code, number] = user.phone.split(" ", 2);
          setInitialData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: number,
            city: user.city,
            address: user.address,
            role: user.role,
          });
          setCountryCode(code);
        } catch (error) {
          Alert.alert("Error", "Failed to fetch user data.");
        }
      };
      fetchUser();
    }
  }, [isEditMode, userId]);

  const fetchRoles = async () => {
    try {
      const roles = await rolesService.getAllRoles();
      const formattedRoles = roles.map((role) => ({
        label: formatRoleDisplayName(role),
        value: role.toLowerCase(),
      }));
      setRoleOptions(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: Partial<UserData>) => {
    const modifiedData = { ...data, phone: `${countryCode} ${data.phone}` };

    try {
      if (isEditMode && userId) {
        await userService.updateUser(modifiedData, userId);
        Alert.alert("Success", "User updated successfully.");
      } else {
        const fileData = image ? { profileImage: image } : {};
        const additionalData = { uploadType: "User" };
        const formData = prepareFormData(
          modifiedData,
          fileData,
          additionalData
        );

        await userService.createUser(formData);
        Alert.alert("Success", "User created successfully.");
      }
      navigation.navigate("ViewUsers" as never);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      Alert.alert("Error", errorMessage);
    }
  };

  const resetForm = () => {
    reset(initialData);
    if (!isEditMode) {
      setImage(null);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetForm();
    2;
    setRefreshing(false);
  }, [reset]);

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title={isEditMode ? "Edit User" : "Add User"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <KeyboardAwareScrollView
          style={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {renderFormInput(
              "firstname",
              "Firstname",
              "Enter firstname",
              control,
              errors
            )}
            {renderFormInput(
              "lastname",
              "Lastname",
              "Enter lastname",
              control,
              errors
            )}
            {renderFormInput(
              "email",
              "Email",
              "example@mail.com",
              control,
              errors
            )}
            {renderFormInput(
              "password",
              "Password",
              "••••••••",
              control,
              errors,
              true,
              true
            )}
            {renderFormInput(
              "phone",
              "Phone",
              "Enter phone number",
              control,
              errors,
              false,
              false,
              true,
              countryCode,
              setCountryCode
            )}
            {renderFormInput("city", "City", "Enter city", control, errors)}
            {renderFormInput(
              "address",
              "Address",
              "Enter address",
              control,
              errors
            )}
            {renderFormInput(
              "role",
              "Role",
              "Select a role",
              control,
              errors,
              false,
              false,
              false,
              undefined,
              undefined,
              false,
              undefined,
              undefined,
              true,
              roleOptions
            )}
            {!isEditMode &&
              renderFormInput(
                "profileImage",
                "Profile Picture",
                "Select an image",
                control,
                errors,
                false,
                false,
                false,
                undefined,
                undefined,
                true,
                image,
                handleImageSelect
              )}
            <components.Button
              title={isEditMode ? "Edit User" : "Create User"}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderFormInput = (
  name: string,
  title: string,
  placeholder: string,
  control: any,
  errors: any,
  eyeOffSvg = false,
  secureTextEntry = false,
  isPhoneField = false,
  countryCode?: string,
  setCountryCode?: (code: string) => void,
  isImageField = false,
  image?: ImageObject | null,
  handleImageSelect?: (image: any) => void,
  isDropdown = false,
  options?: { label: string; value: string }[]
) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value } }) =>
      isDropdown ? (
        <components.Dropdown
          options={options || []}
          selectedValue={value}
          onSelect={(value: string) => onChange(value)}
          placeholder={placeholder}
          label={title}
          error={errors[name]?.message}
        />
      ) : isImageField ? (
        <components.InputField
          title={title}
          placeholder={placeholder}
          containerStyle={{ marginBottom: 20 }}
          image={true}
          imageUri={image?.uri}
          onImageSelect={handleImageSelect}
          error={errors[name]?.message}
        />
      ) : (
        <components.InputField
          title={title}
          placeholder={placeholder}
          containerStyle={{ marginBottom: 20 }}
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          error={errors[name]?.message}
          eyeOffSvg={eyeOffSvg}
          secureTextEntry={secureTextEntry}
          keyboardType={isPhoneField ? "phone-pad" : "default"}
          countryCode={isPhoneField ? countryCode : undefined}
          setCountryCode={isPhoneField ? setCountryCode : undefined}
        />
      )
    }
  />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.COLORS.white },
  scrollContainer: { flex: 1 },
  formContainer: { margin: 22 },
});

export default UserManager;
