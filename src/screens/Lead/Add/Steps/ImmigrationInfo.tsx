import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { components } from "../../../../components";
import { ImmigrationInfoData } from "../interfaces";
import { theme } from "../../../../constants/theme";
import { leadService } from "../../../../api/lead";
import { capitalizeFirstLetter } from "../../../../utils/CapitalizeFirstLetter";

interface ImmigrationInfoProps {
  control: Control<ImmigrationInfoData>;
  errors: FieldErrors<ImmigrationInfoData>;
  clearErrors: (name?: keyof ImmigrationInfoData) => void;
  trigger: any;
}

const ImmigrationInfo: React.FC<ImmigrationInfoProps> = ({
  control,
  errors,
  clearErrors,
  trigger,
}) => {
  const [visaCategories, setVisaCategories] = useState([]);

  const handleFieldChange = useCallback(
    async (field: keyof ImmigrationInfoData) => {
      const result = await trigger(field);
      if (result) {
        clearErrors(field);
      }
    },
    [clearErrors, trigger]
  );

  const fetchVisaCategories = async () => {
    try {
      const response = await leadService.getVisaCategory();

      console.log("Response:", response);
    } catch (error) {
      console.error("Error fetching visa categories");
    }
  };

  useEffect(() => {
    console.log("UseEffect get called>");
    fetchVisaCategories();
  }, []);

  return (
    <View>
      <Text style={styles.stepTitle}>Immigration Information</Text>
      {[
        "passportNumber",
        "countryOfInterest",
        "desiredFieldOfStudy",
        "preferredInstitutions",
        "intakeSession",
        "reasonForImmigration",
        "financialSupport",
        "sponsorDetails",
        "scholarships",
      ].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof ImmigrationInfoData}
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title={capitalizeFirstLetter(field.replace(/([A-Z])/g, " $1"))}
              placeholder={getPlaceholder(field)}
              customBorderColor="#ddd"
              customBackgroundColor="#f5f5f5"
              onChangeText={(text) => {
                onChange(text);
                handleFieldChange(field as keyof ImmigrationInfoData);
              }}
              onBlur={onBlur}
              value={value}
              error={errors[field as keyof ImmigrationInfoData]?.message}
            />
          )}
        />
      ))}

      {["visaCategory"].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof ImmigrationInfoData}
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={getDropdownOptions(field)}
              selectedValue={capitalizeFirstLetter(value as string)}
              onSelect={(value: string) => {
                const val = value.toLowerCase();
                onChange(val);
                handleFieldChange(field as keyof ImmigrationInfoData);
              }}
              error={errors[field as keyof ImmigrationInfoData]?.message}
              placeholder="Select an option"
              label={capitalizeFirstLetter(field)}
            />
          )}
        />
      ))}
    </View>
  );
};

const getPlaceholder = (field: string) => {
  switch (field) {
    case "passportNumber":
      return "A12345678";
    case "countryOfInterest":
      return "Enter Country of Interest";
    case "desiredFieldOfStudy":
      return "Enter Desired Field of Study";
    case "preferredInstitutions":
      return "Enter Preferred Institutions";
    case "intakeSession":
      return "Enter Intake Session";
    case "reasonForImmigration":
      return "Enter Reason for Immigration";
    case "financialSupport":
      return "Enter Financial Support";
    case "sponsorDetails":
      return "Enter Sponsor Details";
    case "scholarships":
      return "Enter Scholarships/Grants";
    case "visaCategory":
      return "Select an option";
    default:
      return "";
  }
};

const getDropdownOptions = (field: string) => {
  switch (field) {
    case "visaCategory":
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

export default ImmigrationInfo;
