import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import StepIndicator from "react-native-step-indicator";
import { Control, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../constants/theme";
import { components } from "../../../components";

import PersonalInfo from "./Steps/PersonalInfo";
import AcademicInfo from "./Steps/AcademicInfo";
import ImmigrationInfo from "./Steps/ImmigrationInfo";
import FinalDetails from "./Steps/FinalDetails";
import LeadPreview from "./Steps/LeadPreview";

import {
  AcademicInfoData,
  FinalDetailsData,
  ImmigrationInfoData,
  LeadData,
  PersonalInfoData,
} from "./interfaces";
import { VALIDATION_SCHEMAS } from "./validations";
import { leadService } from "../../../api/lead";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

const STEP_LABELS = [
  "Personal Details",
  "Academic Details",
  "Immigration Details",
  "Final Details",
  "View Lead Details",
];

const CUSTOM_STYLES = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#32cd32",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#32cd32",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#32cd32",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#32cd32",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#32cd32",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelFontFamily: theme.FONTS.Mulish_600SemiBold.fontFamily,
};

const useFormWithValidation = (currentStep: number) => {
  let schema;
  let formData: any;

  switch (currentStep) {
    case 0:
      schema = VALIDATION_SCHEMAS.personalInfoSchema;
      formData = {} as PersonalInfoData;
      break;
    case 1:
      schema = VALIDATION_SCHEMAS.academicInfoSchema;
      formData = {} as AcademicInfoData;
      break;
    case 2:
      schema = VALIDATION_SCHEMAS.immigrationInfoSchema;
      formData = {} as ImmigrationInfoData;
      break;
    case 3:
      schema = VALIDATION_SCHEMAS.finalDetailsSchema;
      formData = {} as FinalDetailsData;
      break;
    default:
      schema = undefined;
      formData = {} as LeadData;
      break;
  }

  return useForm<typeof formData>({
    resolver: schema ? yupResolver(schema) : undefined,
    mode: "onTouched",
  });
};

type AddLeadNavigationProp = StackNavigationProp<RootStackParamList, "AddLead">;

const AddLead = () => {
  const navigation = useNavigation<AddLeadNavigationProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(new Set());
  const [countryCode, setCountryCode] = useState<string>("+91");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    trigger,
    clearErrors,
  } = useFormWithValidation(currentStep);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const validateCurrentStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setValidatedSteps((prev) => new Set(prev).add(currentStep));
    }
    return isValid;
  };

  const handleStepChange = (stepChange: number) => {
    const newStep = currentStep + stepChange;
    setCurrentStep(newStep);
  };

  const handleStepClick = async (index: number) => {
    if (index > currentStep) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(index);
      }
    } else {
      if (validatedSteps.has(index) || index === currentStep) {
        setCurrentStep(index);
      }
    }
  };

  const onNext: SubmitHandler<LeadData> = async (data) => {
    if (currentStep < STEP_LABELS.length - 1) {
      handleStepChange(1);
      setValidatedSteps((prev) => new Set(prev).add(currentStep));
    } else {
      const updatedData = {
        ...data,
        phone: `${countryCode} ${data.phone}`,
      };
      try {
        await leadService.createLead(updatedData);
        reset();
        setCurrentStep(0);
      } catch (error) {
        console.error("Error while creating lead:", error);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfo
            control={control as Control<PersonalInfoData>}
            errors={errors}
            clearErrors={clearErrors}
            trigger={trigger}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
          />
        );
      case 1:
        return (
          <AcademicInfo
            control={control as Control<AcademicInfoData>}
            errors={errors}
            clearErrors={clearErrors}
            trigger={trigger}
          />
        );
      case 2:
        return (
          <ImmigrationInfo
            control={control as Control<ImmigrationInfoData>}
            errors={errors}
            clearErrors={clearErrors}
            trigger={trigger}
          />
        );
      case 3:
        return (
          <FinalDetails
            control={control as Control<FinalDetailsData>}
            errors={errors}
            clearErrors={clearErrors}
            trigger={trigger}
          />
        );
      case 4:
        return <LeadPreview data={getValues()} countryCode={countryCode} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    clearErrors();
  }, [currentStep, clearErrors]);

  return (
    <SafeAreaView style={styles.container}>
      <components.Header1
        title="Add Lead"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.stepIndicatorContainer}>
        <StepIndicator
          customStyles={CUSTOM_STYLES}
          currentPosition={currentStep}
          labels={STEP_LABELS}
          stepCount={STEP_LABELS.length}
          onPress={(index) => handleStepClick(index)}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          currentStep !== STEP_LABELS.length - 1 && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
      >
        <View style={styles.formContainer}>{renderStepContent()}</View>
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleStepChange(-1)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onNext)}
          >
            <Text style={styles.buttonText}>
              {currentStep === STEP_LABELS.length - 1 ? "Submit" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  stepIndicatorContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: theme.COLORS.black,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: theme.COLORS.white,
    fontFamily: theme.FONTS.Mulish_600SemiBold.fontFamily,
    fontSize: 14,
  },
});

export default AddLead;
