import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header1 from "../../components/Header1";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../constants/theme";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { components } from "../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";
import {
  canadianDegreeOptions,
  educationOptions,
  jobOfferOptions,
  languageOptions,
  nominationOptions,
  siblingOptions,
  spouseOptions,
  workExperienceOptions,
} from "../../utils/Calculateoptions";
import { crsService } from "../../api/crscalculator";

interface Option {
  label: string;
  value: string;
}

interface ImageObject {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface FormValues {
  name: string;
  phone: string;
  email: string;
  age: number;
  education: string;
  foreign_experience: string;
  canadian_experience: string;
  first_language: string;
  second_language: string | null;
  spouse: string;
  sibling_in_canada: string;
  job_offer: string;
  provincial_nomination: string;
  canadian_degree: string;
  spouse_education: string;
  spouse_language: string | null;
  spouse_experience: string;
}

const Calculatecrs = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState<string>("+91");
  const [userData, setUserData] = useState<FormValues | null>(null);
  const [userScore, setUserScore] = useState(0);
  const maxScore = 1200;
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useState(new Animated.Value(0))[0];
  const [refreshing, setRefreshing] = useState(false);

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

  const closeModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const getScoreColor = (score: any) => {
    if (score >= 80) return "green";
    if (score >= 50) return "orange";
    return "red";
  };

  const calculateCRS = (data: any) => {
    setLoading(true);

    let score = 0;

    // Calculate age points
    const age = parseInt(data.age.toString());
    if (age >= 18 && age <= 29) score += 110;
    else if (age === 30) score += 105;
    else if (age === 31) score += 99;
    else if (age === 32) score += 94;
    else if (age === 33) score += 88;
    else if (age === 34) score += 83;
    else if (age === 35) score += 77;
    else if (age === 36) score += 72;
    else if (age === 37) score += 66;
    else if (age === 38) score += 61;
    else if (age === 39) score += 55;
    else if (age === 40) score += 50;
    else if (age === 41) score += 39;
    else if (age === 42) score += 28;
    else if (age === 43) score += 17;
    else if (age === 44) score += 6;
    else if (age >= 45) score += 0;

    // Calculate education points
    const education = data.education;
    if (education === "phd") score += 150;
    else if (education === "masters") score += 135;
    else if (education === "bachelors") score += 120;

    // Calculate work experience points
    const foreignExperience = data.foreign_experience;
    const canadianExperience = data.canadian_experience;
    if (foreignExperience === "5_or_more") score += 50;
    else if (foreignExperience === "3_to_4") score += 40;
    else if (foreignExperience === "1_to_2") score += 25;

    if (canadianExperience === "5_or_more") score += 80;
    else if (canadianExperience === "3_to_4") score += 72;
    else if (canadianExperience === "1_to_2") score += 64;

    // Calculate language proficiency points
    const firstLanguage = data.first_language;
    if (firstLanguage === "clb 9") score += 136;
    else if (firstLanguage === "clb 8") score += 124;
    else if (firstLanguage === "clb 7") score += 112;

    // Additional points for second language
    const secondLanguage = data.second_language;
    if (secondLanguage === "clb 9") score += 24;
    else if (secondLanguage === "clb 8") score += 20;
    else if (secondLanguage === "clb 7") score += 16;

    // Calculate additional points
    if (data.sibling_in_canada === "yes") score += 15;
    if (data.job_offer === "yes") score += 50;
    if (data.provincial_nomination === "yes") score += 600;
    if (data.canadian_degree === "yes") score += 30;

    // Calculate spouse points
    if (data.spouse === "yes") {
      const spouseEducation = data.spouse_education;
      if (spouseEducation === "phd") score += 10;
      else if (spouseEducation === "masters") score += 9;
      else if (spouseEducation === "bachelors") score += 8;

      const spouseLanguage = data.spouse_language;
      if (spouseLanguage === "CLB 9") score += 20;
      else if (spouseLanguage === "CLB 8") score += 18;
      else if (spouseLanguage === "CLB 7") score += 16;

      const spouseExperience = data.spouse_experience;
      if (spouseExperience === "5_or_more") score += 10;
      else if (spouseExperience === "3_to_4") score += 8;
      else if (spouseExperience === "1_to_2") score += 5;
    }

    score = Math.min(score, maxScore);

    setUserData(data);
    setUserScore(score);
    setLoading(false);
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 200,
    }).start();
  };

  const handleSaveScores = async () => {
    if (userData) {
      const dataToSave = {
        ...userData,
        phone: `${countryCode} ${userData.phone}`,
        score: userScore,
      };

      try {
        await crsService.saveScore(dataToSave);
        Alert.alert("Score saved successfully");
      } catch (error) {
        console.error("Error saving scores:", error);
      }
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const spouseValue = watch("spouse");
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
        {renderFormInput("name", "Name", "Enter your name", control, errors)}
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
        {renderFormInput("email", "Email", "example@mail.com", control, errors)}
        {renderFormInput("age", "Age", "Enter your age", control, errors)}
        {renderFormInput(
          "education",
          "Education Level",
          "Select",
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
          educationOptions
        )}
        {renderFormInput(
          "foreign_experience",
          "Foreign Work Experience",
          "Select",
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
          workExperienceOptions
        )}
        {renderFormInput(
          "canadian_experience",
          "Canadian Work Experience",
          "Select",
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
          workExperienceOptions
        )}
        {renderFormInput(
          "first_language",
          "First Language Proficiency",
          "Select",
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
          languageOptions
        )}
        {renderFormInput(
          "second_language",
          "Second Language Proficiency (if any)",
          "Select",
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
          languageOptions
        )}
        {renderFormInput(
          "spouse",
          "Do you have a spouse or common-law partner?",
          "Select",
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
          spouseOptions
        )}
        {spouseValue === "yes" && (
          <>
            {renderFormInput(
              "spouse_education",
              "Spouse’s Education Level",
              "Select",
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
              educationOptions
            )}
            {renderFormInput(
              "spouse_language",
              "Spouse’s Language Proficiency (if any)",
              "Select",
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
              languageOptions
            )}
            {renderFormInput(
              "spouse_experience",
              "Spouse’s Canadian Work Experience",
              "Select",
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
              workExperienceOptions
            )}
          </>
        )}
        {renderFormInput(
          "sibling_in_canada",
          "Do you have a sibling in Canada?",
          "Select",
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
          siblingOptions
        )}
        {renderFormInput(
          "job_offer",
          "Do you have a valid job offer?",
          "Select",
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
          jobOfferOptions
        )}
        {renderFormInput(
          "provincial_nomination",
          "Do you have a provincial nomination?",
          "Select",
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
          nominationOptions
        )}
        {renderFormInput(
          "canadian_degree",
          "Do you have a Canadian degree, certificate?",
          "Select",
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
          canadianDegreeOptions
        )}
        <components.Button
          title="Calculate"
          onPress={handleSubmit(calculateCRS)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>{renderContent()}</ScrollView>
      {loading && <components.Spinner />}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <View>
              <Text
                style={{
                  textAlign: "center",
                  color: getScoreColor(userScore),
                  fontSize: 24,
                  ...theme.FONTS.Mulish_700Bold,
                }}
              >
                Score: {userScore}
              </Text>
              <View style={styles.modalContent}>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Name: </Text>
                  <Text style={styles.modalText}>{userData?.name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Age: </Text>
                  <Text style={styles.modalText}>{userData?.age}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Canadian Degree: </Text>
                  <Text style={styles.modalText}>
                    {userData?.canadian_degree}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Canadian Experience: </Text>
                  <Text style={styles.modalText}>
                    {userData?.canadian_experience}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Education: </Text>
                  <Text style={styles.modalText}>{userData?.education}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Email: </Text>
                  <Text style={styles.modalText}>{userData?.email}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>First Language: </Text>
                  <Text style={styles.modalText}>
                    {userData?.first_language}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Foreign Experience: </Text>
                  <Text style={styles.modalText}>
                    {userData?.foreign_experience}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Job Offer: </Text>
                  <Text style={styles.modalText}>{userData?.job_offer}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>
                    Provincial Nomination:{" "}
                  </Text>
                  <Text style={styles.modalText}>
                    {userData?.provincial_nomination}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.modalHeading}>Spouse: </Text>
                  <Text style={styles.modalText}>{userData?.spouse}</Text>
                </View>
                {userData?.spouse === "yes" && (
                  <>
                    <View style={styles.row}>
                      <Text style={styles.modalHeading}>
                        Spouse Education:{" "}
                      </Text>
                      <Text style={styles.modalText}>
                        {userData?.spouse_education}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.modalHeading}>
                        Spouse Experience:{" "}
                      </Text>
                      <Text style={styles.modalText}>
                        {userData?.spouse_experience}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.modalHeading}>Spouse Language: </Text>
                      <Text style={styles.modalText}>
                        {userData?.spouse_language}
                      </Text>
                    </View>
                  </>
                )}
              </View>
              <View style={styles.actionBtnArea}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleSaveScores}
                >
                  <Text style={styles.closeButtonText}>Save Scores</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  options?: Option[],
  onSelect?: (value: string) => void
) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value } }) =>
      isDropdown ? (
        <components.Dropdown
          options={options}
          selectedValue={value}
          onSelect={(value: string) => {
            onChange(value);
            if (onSelect) onSelect(value);
          }}
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
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  formContainer: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  modalHeading: {
    fontSize: 16,
    width: 160,
    ...theme.FONTS.Mulish_600SemiBold,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    ...theme.FONTS.Mulish_400Regular,
  },
  closeButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    ...theme.FONTS.Mulish_400Regular,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  actionBtnArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default Calculatecrs;
