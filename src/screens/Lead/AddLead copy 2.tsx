import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import StepIndicator from "react-native-step-indicator";
import { components } from "../../components";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const labels = [
  "Personal Details",
  "Academic Details",
  "Immigration Details",
  "Final Details",
  "View Lead Details",
];
const customStyles = {
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
};

const step1Schema = Yup.object().shape({
  firstname: Yup.string().required("Please enter your First Name").trim(),
  lastname: Yup.string().required("Please enter your Last Name").trim(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .required("Please enter your Phone Number")
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .trim(),
  gender: Yup.string().required("Please select your Gender"),
  nationality: Yup.string().required("Please enter your Nationality"),
  maritalStatus: Yup.string().required("Please select your Marital Status"),
  country: Yup.string().required("Please enter your Country"),
  state: Yup.string().required("Please enter your State"),
  district: Yup.string().required("Please enter your District"),
  pincode: Yup.string()
    .required("Please enter your Pincode")
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
    .trim(),
  currentAddress: Yup.string()
    .required("Please enter your Current Address")
    .trim(),
  permanentAddress: Yup.string()
    .required("Please enter your Permanent Address")
    .trim(),
});

const step2Schema = Yup.object().shape({
  highestQualification: Yup.string()
    .required("Please enter your Highest Qualification")
    .trim(),
  fieldOfStudy: Yup.string().nullable(),
  institutionName: Yup.string().nullable(),
  graduationYear: Yup.string().nullable(),
  grade: Yup.string().nullable(),
  testType: Yup.string().nullable(),
  testScore: Yup.string().nullable(),
});

const step3Schema = Yup.object().shape({
  passportNumber: Yup.string()
    .nullable()
    .matches(
      /(^$)|(^[A-PR-WYa-pr-wy][0-9]\d\s?\d{4}[0-9]$)/,
      "Passport number must be exactly 8 characters"
    )
    .trim(),
  visaCategory: Yup.string().required("Please select your Visa Category"),
  courseOfInterest: Yup.string().nullable(),
  desiredFieldOfStudy: Yup.string().nullable(),
  preferredInstitutions: Yup.string().nullable(),
  intakeSession: Yup.string().nullable(),
  reasonForImmigration: Yup.string().nullable(),
  financialSupport: Yup.string().nullable(),
  sponsorDetails: Yup.string().nullable(),
  scholarships: Yup.string().nullable(),
});

const step4Schema = Yup.object().shape({
  communicationMode: Yup.string().nullable(),
  preferredContactTime: Yup.string().nullable(),
  leadSource: Yup.string().required("Please enter source of lead"),
  referralContact: Yup.string().nullable(),
  leadRating: Yup.string().nullable(),
});

const validationSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

const AddLead = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchemas[currentStep]),
    mode: "onTouched",
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const onNext = (data) => {
    if (currentStep < labels.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit final data
      console.log("All Data:", data);
      // Reset the form after submission
      reset();
      setCurrentStep(0);
    }
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={labels}
          stepCount={labels.length}
        />

        <View style={styles.formContainer}>
          {currentStep === 0 && (
            <View>
              <Text style={styles.stepTitle}>Personal Information</Text>
              <Controller
                control={control}
                name="firstname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="First Name"
                    placeholder="John"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
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
                    title="Last Name"
                    placeholder="Doe"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
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
                    placeholder="example@gmail.com"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Phone"
                    placeholder="99999-99999"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.phone?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={["Male", "Female", "Other"]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.gender?.message}
                    placeholder="Select an option"
                    label="Gender"
                  />
                )}
              />
              <Controller
                control={control}
                name="nationality"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={["Indian", "Other"]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.nationality?.message}
                    placeholder="Select an option"
                    label="Nationality"
                  />
                )}
              />
              <Controller
                control={control}
                name="maritalStatus"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={[
                      "Single",
                      "Married",
                      "Divorced",
                      "Widowed",
                      "Separated",
                    ]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.maritalStatus?.message}
                    placeholder="Select an option"
                    label="Marital Status"
                  />
                )}
              />
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={["Option 1", "Option 2", "Option 3"]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.country?.message}
                    placeholder="Select an option"
                    label="Country"
                  />
                )}
              />
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={["Option 1", "Option 2", "Option 3"]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.state?.message}
                    placeholder="Select an option"
                    label="State"
                  />
                )}
              />
              <Controller
                control={control}
                name="district"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={["Option 1", "Option 2", "Option 3"]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.district?.message}
                    placeholder="Select an option"
                    label="District"
                  />
                )}
              />
              <Controller
                control={control}
                name="pincode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Pincode"
                    placeholder="000000"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.pincode?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="currentAddress"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Current Address"
                    placeholder="Enter Current Address"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.currentAddress?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="permanentAddress"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Permanent Address"
                    placeholder="Enter Permanent Address"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.permanentAddress?.message}
                  />
                )}
              />
            </View>
          )}
          {currentStep === 1 && (
            <View>
              <Text style={styles.stepTitle}>Academic Information</Text>
              <Controller
                control={control}
                name="highestQualification"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Highest Qualification"
                    placeholder="Enter Highest Qualification"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.highestQualification?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="fieldOfStudy"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Field of Study"
                    placeholder="Enter Field of Study"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.fieldOfStudy?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="institutionName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Institution Name"
                    placeholder="Enter Institution Name"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.institutionName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="graduationYear"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Graduation Year"
                    placeholder="Enter Graduation Year"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.graduationYear?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="grade"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Grade/Percentage/CGPA"
                    placeholder="Enter Grade/Percentage/CGPA"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.grade?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="testType"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Test Type"
                    placeholder="Enter Test Type"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.grade?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="testScore"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Test Score"
                    placeholder="Enter Test Score"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.testType?.message}
                  />
                )}
              />
            </View>
          )}
          {currentStep === 2 && (
            <View>
              <Text style={styles.stepTitle}>Immigration Information</Text>
              <Controller
                control={control}
                name="passportNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Passport Number"
                    placeholder="A12345678"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.passportNumber?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="visaCategory"
                render={({ field: { onChange, value } }) => (
                  <components.Dropdown
                    options={["Option 1", "Option 2", "Option 3"]}
                    selectedValue={value}
                    onSelect={(value: string) => onChange(value)}
                    error={errors.visaCategory?.message}
                    placeholder="Select an option"
                    label="Visa Category"
                  />
                )}
              />
              <Controller
                control={control}
                name="countryOfInterest"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Country of Interest"
                    placeholder="Enter Country of Interest"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.countryOfInterest?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="desiredFieldOfStudy"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Desired Field of Study"
                    placeholder="Enter Desired Field of Study"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.desiredFieldOfStudy?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="preferredInstitutions"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Preferred Institutions"
                    placeholder="Enter Preferred Institutions"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.preferredInstitutions?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="intakeSession"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Intake Session"
                    placeholder="Enter Intake Session"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.intakeSession?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="reasonForImmigration"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Reason for Immigration"
                    placeholder="Enter Reason for Immigration"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.reasonForImmigration?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="financialSupport"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Financial Support"
                    placeholder="Enter Financial Support"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.financialSupport?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="sponsorDetails"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Sponsor Details"
                    placeholder="Enter Sponsor Details"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.sponsorDetails?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="scholarships"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Scholarships/Grants"
                    placeholder="Enter Scholarships/Grants"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.scholarships?.message}
                  />
                )}
              />
            </View>
          )}
          {currentStep === 3 && (
            <View>
              <Text style={styles.stepTitle}>Final Details</Text>
              <Controller
                control={control}
                name="communicationMode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Preferred Mode of Communication"
                    placeholder="Write Here"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.communicationMode?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="preferredContactTime"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Preferred Time for Contact"
                    placeholder="Write Here"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.preferredContactTime?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="leadSource"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Source of Lead"
                    placeholder="Enter Source of Lead"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.leadSource?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="referralContact"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Referral Name/Contact"
                    placeholder="Enter Referral Name/Contact"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.referralContact?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="leadRating"
                render={({ field: { onChange, onBlur, value } }) => (
                  <components.InputField
                    title="Lead Rating"
                    placeholder="Enter Lead Rating"
                    customBorderColor="#ddd"
                    customBackgroundColor="#f5f5f5"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.leadRating?.message}
                  />
                )}
              />
            </View>
          )}
          {currentStep === 4 && (
            <View>
              <Text style={styles.stepTitle}>View Lead Details</Text>
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Lead Preview</Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <Button title="Back" onPress={onBack} color="black" />
          )}
          <Button
            title={currentStep === labels.length - 1 ? "Submit" : "Next"}
            onPress={handleSubmit(onNext)}
            color="black"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const renderHeader = () => {
  return <components.Header title="Add Lead" goBack={true} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  formContainer: {
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  tableLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  tableValue: {
    fontSize: 16,
    color: "#333",
  },
});

export default AddLead;
