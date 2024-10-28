import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { components } from "../../../../components";
import { FinalDetailsData } from "../interfaces";
import { theme } from "../../../../constants/theme";
import { capitalizeFirstLetter } from "../../../../utils/CapitalizeFirstLetter";
import { sourceOptions } from "../../../../utils/options";

interface FinalDetailsProps {
  control: Control<FinalDetailsData>;
  errors: FieldErrors<FinalDetailsData>;
  clearErrors: (name?: keyof FinalDetailsData) => void;
  trigger: any;
}

interface Option {
  label: string;
  value: string;
}

const getDropdownOptions = (field: string, sourceOptions: Option[]) => {
  switch (field) {
    case "leadSource":
      return sourceOptions;
    default:
      return [];
  }
};

const FinalDetails: React.FC<FinalDetailsProps> = ({
  control,
  errors,
  clearErrors,
  trigger,
}) => {
  const handleFieldChange = useCallback(
    async (field: keyof FinalDetailsData) => {
      const result = await trigger(field);
      if (result) {
        clearErrors(field);
      }
    },
    [clearErrors, trigger]
  );

  return (
    <View>
      <Text style={styles.stepTitle}>Final Details</Text>
      {[
        "communicationMode",
        "preferredContactTime",
        "referralContact",
        "followUpDates",
        "leadRating",
      ].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof FinalDetailsData}
          render={({ field: { onChange, onBlur, value } }) =>
            field === "followUpDates" ? (
              <components.InputField
                title="FollowUp Dates"
                placeholder="DD/MM/YYYY"
                datePicker
                customBorderColor="#ddd"
                customBackgroundColor="#f5f5f5"
                date={value ? value : undefined}
                onDateChange={(date) => {
                  onChange(date);
                  handleFieldChange(field as keyof FinalDetailsData);
                }}
                error={errors[field as keyof FinalDetailsData]?.message}
              />
            ) : (
              <components.InputField
                title={capitalizeFirstLetter(field.replace(/([A-Z])/g, " $1"))}
                placeholder={getPlaceholder(field)}
                customBorderColor="#ddd"
                customBackgroundColor="#f5f5f5"
                onChangeText={(text) => {
                  onChange(text);
                  handleFieldChange(field as keyof FinalDetailsData);
                }}
                onBlur={onBlur}
                value={typeof value === "string" ? value : ""}
                error={errors[field as keyof FinalDetailsData]?.message}
              />
            )
          }
        />
      ))}
      {["leadSource"].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof FinalDetailsData}
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={getDropdownOptions(field, sourceOptions)}
              selectedValue={value}
              onSelect={(value: string) => {
                onChange(value);
                handleFieldChange(field as keyof FinalDetailsData);
              }}
              error={errors[field as keyof FinalDetailsData]?.message}
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
    case "communicationMode":
      return "Write Here";
    case "preferredContactTime":
      return "Write Here";
    case "referralContact":
      return "Enter Referral Name/Contact";
    case "leadSource":
      return "Select an option";
    case "leadRating":
      return "Enter Lead Rating";
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

export default FinalDetails;
