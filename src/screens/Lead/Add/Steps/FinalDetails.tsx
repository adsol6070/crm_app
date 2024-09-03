import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { components } from "../../../../components";
import { FinalDetailsData } from "../interfaces";
import { theme } from "../../../../constants/theme";

interface FinalDetailsProps {
  control: Control<FinalDetailsData>;
  errors: FieldErrors<FinalDetailsData>;
  clearErrors: (name?: keyof FinalDetailsData) => void;
  trigger: any;
}

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
        "leadSource",
        "referralContact",
        "leadRating",
      ].map((field, index) => (
        <Controller
          key={index}
          control={control}
          name={field as keyof FinalDetailsData}
          render={({ field: { onChange, onBlur, value } }) => (
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
              value={value}
              error={errors[field as keyof FinalDetailsData]?.message}
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
    case "communicationMode":
      return "Write Here";
    case "preferredContactTime":
      return "Write Here";
    case "leadSource":
      return "Enter Source of Lead";
    case "referralContact":
      return "Enter Referral Name/Contact";
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
