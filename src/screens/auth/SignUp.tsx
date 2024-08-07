import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
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

const schema = yup.object().shape({
  tenantId: yup.string().required("Tenant ID is required"),
  firstname: yup.string().required("First name is required"),
  lastname: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const SignUp = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    // Handle form submission logic here
  };

  const renderHeader = () => {
    return <components.Header title="Sign up" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: theme.SIZES.height * 0.06,
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
              onChangeText={onChange}
              onBlur={onBlur}
              eyeOffSvg={true}
              value={value}
              secureTextEntry={true}
              error={errors.password?.message}
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
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default SignUp;
