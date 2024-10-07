import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, RefreshControl, View, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { components } from "../../../../components";
import { rolesService } from "../../../../api/roles";
import { theme } from "../../../../constants/theme";
import Header1 from "../../../../components/Header1";
import { formatRoleDisplayName } from "../../../../utils/FormatRoleDisplayName";

interface ImageObject {
  uri: string;
  name: string;
  type: string;
  size: number;
}

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

const UserForm = ({
  onSubmit,
  initialData,
  isEditMode,
  image,
  setImage,
  countryCode,
  setCountryCode,
}: any) => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema(isEditMode)),
  });

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

  const handleImageSelect = (image: any) =>
    setImage({
      uri: image.uri,
      name: image.fileName || "unknown",
      type: image.mimeType || "image/jpeg",
      size: image.fileSize || 0,
    });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetForm();
    setRefreshing(false);
  }, [reset]);

  const resetForm = () => {
    reset(initialData);
    if (!isEditMode) {
      setImage(null);
    }
  };

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

export default UserForm;
