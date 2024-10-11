import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { components } from "../../../../components";
import { AcademicInfoData } from "../interfaces";
import { theme } from "../../../../constants/theme";
import { capitalizeFirstLetter } from "../../../../utils/CapitalizeFirstLetter";

interface AcademicInfoProps {
  control: Control<AcademicInfoData>;
  errors: FieldErrors<AcademicInfoData>;
  clearErrors: (name?: keyof AcademicInfoData) => void;
  trigger: any;
}

const AcademicInfo: React.FC<AcademicInfoProps> = ({
  control,
  errors,
  clearErrors,
  trigger,
}) => {
  const handleFieldChange = useCallback(
    async (field: keyof AcademicInfoData) => {
      const result = await trigger(field);
      if (result) {
        clearErrors(field);
      }
    },
    [clearErrors, trigger]
  );

  return (
    <View>
      <Text style={styles.stepTitle}>Academic Information</Text>
      {[
        "highestQualification",
        "fieldOfStudy",
        "institutionName",
        "graduationYear",
        "grade",
        "testType",
        "testScore",
      ].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof AcademicInfoData}
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title={capitalizeFirstLetter(field.replace(/([A-Z])/g, " $1"))}
              placeholder={getPlaceholder(field)}
              customBorderColor="#ddd"
              customBackgroundColor="#f5f5f5"
              onChangeText={(text) => {
                onChange(text);
                handleFieldChange(field as keyof AcademicInfoData);
              }}
              onBlur={onBlur}
              value={value}
              error={errors[field as keyof AcademicInfoData]?.message}
            />
          )}
        />
      ))}
    </View>
  );
};

const getPlaceholder = (field: string) => {
  switch (field) {
    case "highestQualification":
      return "Enter Highest Qualification";
    case "fieldOfStudy":
      return "Enter Field of Study";
    case "institutionName":
      return "Enter Institution Name";
    case "graduationYear":
      return "Enter Graduation Year";
    case "grade":
      return "Enter Grade/Percentage/CGPA";
    case "testType":
      return "Enter Test Type";
    case "testScore":
      return "Enter Test Score";
    default:
      return "";
  }
};

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 17,
    marginBottom: 10,
    ...theme.FONTS.Mulish_700Bold,
  },
});

export default AcademicInfo;
