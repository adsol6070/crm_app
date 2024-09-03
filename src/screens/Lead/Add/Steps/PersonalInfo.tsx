import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { components } from "../../../../components";
import { PersonalInfoData } from "../interfaces";
import { theme } from "../../../../constants/theme";

interface PersonalInfoProps {
  control: Control<PersonalInfoData>;
  errors: FieldErrors<PersonalInfoData>;
  clearErrors: (name?: keyof PersonalInfoData) => void;
  trigger: any;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  control,
  errors,
  clearErrors,
  trigger,
}) => {
  const handleFieldChange = useCallback(
    async (field: keyof PersonalInfoData) => {
      const result = await trigger(field);
      if (result) {
        clearErrors(field);
      }
    },
    [clearErrors, trigger]
  );

  const formatDate = (date: Date) => {
    const updatedDate = new Date(date);
    const day = String(updatedDate.getDate()).padStart(2, "0");
    const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
    const year = updatedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View>
      <Text style={styles.stepTitle}>Personal Information</Text>
      {[
        "firstname",
        "lastname",
        "email",
        "phone",
        "dob",
        "pincode",
        "currentAddress",
        "permanentAddress",
      ].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof PersonalInfoData}
          render={({ field: { onChange, onBlur, value } }) =>
            field === "dob" ? (
              <components.InputField
                title="Date of Birth"
                placeholder="DD/MM/YYYY"
                datePicker
                disableFutureDates
                customBorderColor="#ddd"
                customBackgroundColor="#f5f5f5"
                date={value ? formatDate(value as Date) : undefined}
                onDateChange={(date) => {
                  onChange(date.toISOString());
                  handleFieldChange(field as keyof PersonalInfoData);
                }}
                error={errors[field as keyof PersonalInfoData]?.message}
              />
            ) : (
              <components.InputField
                title={capitalizeFirstLetter(field.replace(/([A-Z])/g, " $1"))}
                placeholder={getPlaceholder(field)}
                customBorderColor="#ddd"
                customBackgroundColor="white"
                onChangeText={(text) => {
                  onChange(text);
                  handleFieldChange(field as keyof PersonalInfoData);
                }}
                onBlur={onBlur}
                value={typeof value === "string" ? value : ""}
                error={errors[field as keyof PersonalInfoData]?.message}
              />
            )
          }
        />
      ))}

      {[
        "gender",
        "nationality",
        "maritalStatus",
        "country",
        "state",
        "district",
      ].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof PersonalInfoData}
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={getDropdownOptions(field)}
              selectedValue={value}
              onSelect={(value: string) => {
                onChange(value);
                handleFieldChange(field as keyof PersonalInfoData);
              }}
              error={errors[field as keyof PersonalInfoData]?.message}
              placeholder="Select an option"
              label={capitalizeFirstLetter(field)}
            />
          )}
        />
      ))}
    </View>
  );
};

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const getPlaceholder = (field: string) => {
  switch (field) {
    case "firstname":
      return "John";
    case "lastname":
      return "Doe";
    case "email":
      return "example@gmail.com";
    case "phone":
      return "99999-99999";
    case "gender":
      return "Select an option";
    case "nationality":
      return "Select an option";
    case "maritalStatus":
      return "Select an option";
    case "country":
      return "Select an option";
    case "state":
      return "Select an option";
    case "district":
      return "Select an option";
    case "pincode":
      return "000000";
    case "currentAddress":
      return "Enter Current Address";
    case "permanentAddress":
      return "Enter Permanent Address";
    default:
      return "";
  }
};

const getDropdownOptions = (field: string) => {
  switch (field) {
    case "gender":
      return ["Male", "Female", "Other"];
    case "nationality":
      return ["Indian", "Other"];
    case "maritalStatus":
      return ["Single", "Married", "Divorced", "Widowed", "Separated"];
    case "country":
    case "state":
    case "district":
      return ["Option 1", "Option 2", "Option 3"];
    default:
      return [];
  }
};

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 17,
    marginBottom: 10,
    ...theme.FONTS.Mulish_700Bold,
  },
});

export default PersonalInfo;
