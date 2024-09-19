import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header1 from "../../components/Header1";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../constants/theme";
import { ScrollView } from "react-native-gesture-handler";
import { components } from "../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";
import {
  educationOptions,
  languageOptions,
  spouseOptions,
  workExperienceOptions,
} from "../../utils/Calculateoptions";

const Calculatecrs = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState<string>("+91");

  const schema = yup.object().shape({
    name: yup.string().required("Please enter your name").trim(),
    phone: yup
      .string()
      .required("Please enter your phone number")
      .matches(/^\d{10}$/, "Phone number is not valid")
      .trim(),
    email: yup
      .string()
      .required("Please enter your email")
      .email("Email is not valid")
      .trim(),
    age: yup
      .number()
      .required("Please enter your age")
      .min(18, "Minimum age is 18")
      .max(47, "Maximum age is 47"),
    education: yup.string().required("Please select your education level"),
    foreign_experience: yup
      .string()
      .required("Please select your foreign work experience"),
    canadian_experience: yup
      .string()
      .required("Please select your Canadian work experience"),
    first_language: yup
      .string()
      .required("Please select your first language proficiency"),
    second_language: yup.string().nullable(),
    spouse: yup
      .string()
      .required("Please indicate if you have a spouse or common-law partner"),
    sibling_in_canada: yup
      .string()
      .required("Please indicate if you have a sibling in Canada"),
    job_offer: yup.string().required("Please indicate if you have a job offer"),
    provincial_nomination: yup
      .string()
      .required("Please indicate if you have a provincial nomination"),
    canadian_degree: yup
      .string()
      .required(
        "Please indicate if you have a Canadian degree, diploma, or certificate"
      ),
    spouse_education: yup.string().nullable(),
    spouse_language: yup.string().nullable(),
    spouse_experience: yup.string().nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const renderHeader = () => {
    return (
      <Header1
        title="Calculate CRS"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Name"
              placeholder="Enter your name"
              customBorderColor="#ddd"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Phone"
              placeholder="Enter phone number"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="phone-pad"
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              error={errors.phone?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Email"
              placeholder="Enter your email"
              customBorderColor="#ddd"
              customBackgroundColor={theme.COLORS.white}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Age"
              placeholder="Enter your age"
              customBorderColor="#ddd"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.age?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="education"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={educationOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Education Level"
              error={errors.education?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="foreign_experience"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={workExperienceOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Foreign Work Experience"
              error={errors.foreign_experience?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="canadian_experience"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={workExperienceOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Canadian Work Experience"
              error={errors.canadian_experience?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="first_language"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={languageOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="First Language Proficiency"
              error={errors.first_language?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="second_language"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={languageOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Second Language Proficiency (if any)"
              error={errors.second_language?.message}
            />
          )}
        />
         <Controller
          control={control}
          name="spouse"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={spouseOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Do you have a spouse or common-law partner?"
              error={errors.spouse?.message}
            />
          )}
        />
         <Controller
          control={control}
          name="spouse_education"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={educationOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Spouse’s Education Level"
              error={errors.spouse_education?.message}
            />
          )}
        />
         <Controller
          control={control}
          name="spouse_language"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={languageOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Spouse’s Language Proficiency (if any)"
              error={errors.spouse_language?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="spouse_language"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={languageOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Spouse’s Language Proficiency (if any)"
              error={errors.spouse_language?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="spouse_language"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={languageOptions}
              selectedValue={capitalizeFirstLetter(value)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
              }}
              placeholder="Select"
              label="Spouse’s Language Proficiency (if any)"
              error={errors.spouse_language?.message}
            />
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  formContainer: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
});

export default Calculatecrs;
