import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { theme } from "../../constants/theme";
import { components } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { authService } from "../../api/auth";
import Toast from "react-native-toast-message";
import AwesomeAlert from "react-native-awesome-alerts";

const schema = yup.object().shape({
  tenantId: yup.string().required("Tenant ID is required"),
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: yup.string().required("Phone number is required"),
  profileImage: yup.mixed(),
});

type SignUpFormData = yup.InferType<typeof schema>;

interface ImageObject {
  uri: string;
  name: string;
  type: string;
  size: number;
}

const SignUp = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [image, setImage] = useState<ImageObject | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [countryCode, setCountryCode] = useState<string>("+91");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  const resetSignUpForm = () => {
    reset();
    setImage(null);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetSignUpForm();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const profileImage: ImageObject = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || "unknown",
        type: result.assets[0].mimeType || "image/jpeg",
        size: result.assets[0].fileSize || 0,
      };

      setImage(profileImage);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const formData = new FormData();
      formData.append("tenantID", data.tenantId);
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("phone", `${countryCode}${data.phone}`);
      formData.append("role", "superAdmin");
      formData.append("uploadType", "User");

      if (image) {
        formData.append("profileImage", image);
      }

      const response = await authService.register(formData);
      console.log("Response:", response);

      Toast.show({
        type: "success",
        position: "top",
        text1: "Success",
        text2: "You have successfully signed up!",
        autoHide: true,
      });
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: theme.SIZES.height * 0.04,
          flexGrow: 1,
        }}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            textAlign: "center",
            ...theme.FONTS.H1,
            marginBottom: 30,
            textTransform: "capitalize",
            color: theme.COLORS.black,
          }}
        >
          Sign up
        </Text>

        <TouchableOpacity
          onPress={handleImagePicker}
          style={{ marginBottom: 20, alignItems: "center" }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: theme.COLORS.lightGray,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={{ width: "100%", height: "100%", borderRadius: 50 }}
              />
            ) : (
              <Text style={{ color: theme.COLORS.gray1 }}>Select Image</Text>
            )}
          </View>
        </TouchableOpacity>

        <Controller
          control={control}
          name="tenantId"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Tenant ID"
              placeholder="Enter your tenant ID"
              containerStyle={{ marginBottom: 20 }}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.tenantId?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="firstname"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="First Name"
              placeholder="Enter your firstname"
              containerStyle={{ marginBottom: 20 }}
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
              placeholder="Enter your lastname"
              containerStyle={{ marginBottom: 20 }}
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
              placeholder="Enter your email"
              containerStyle={{ marginBottom: 20 }}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Password"
              placeholder="Enter your password"
              containerStyle={{ marginBottom: 20 }}
              eyeOffSvg={true}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              secureTextEntry={true}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Phone"
              placeholder="Enter your phone number"
              containerStyle={{ marginBottom: 20 }}
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

        <components.Button
          title="Sign up"
          onPress={handleSubmit(onSubmit)}
          containerStyle={{ marginBottom: 20 }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text
            style={{
              fontFamily: "Mulish_400Regular",
              fontSize: 16,
              color: theme.COLORS.gray1,
              marginRight: 3,
            }}
          >
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                color: theme.COLORS.black,
              }}
            >
              Sign in.
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
