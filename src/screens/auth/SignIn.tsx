import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from "react-native";
import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { constants } from '../../constants';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { components } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SafeAreaView } from "react-native-safe-area-context";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const { theme } = constants;

const SignIn = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Text
            style={{
              textAlign: "center",
              ...theme.FONTS.H1,
              marginBottom: 30,
              textTransform: "capitalize",
              color: theme.COLORS.black,
            }}
          >
            Sign In
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Sign in to continue
          </Text>
        </View>
        <View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <components.InputField
                title="Email"
                placeholder="example@mail.com"
                containerStyle={styles.inputField}
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
                placeholder="••••••••"
                containerStyle={styles.inputField}
                eyeOffSvg={true}
                secureTextEntry={true}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.password?.message}
              />
            )}
          />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotPasswordText}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
        <components.Button
          title="Sign in"
          containerStyle={styles.button}
          onPress={handleSubmit(onSubmit)}
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
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text
              style={{
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                color: theme.COLORS.black,
              }}
            >
              Sign Up.
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: theme.SIZES.height * 0.05,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 16 * 1.7,
    color: theme.COLORS.gray1,
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
  },
  inputField: {
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    lineHeight: 16 * 1.7,
    color: theme.COLORS.black,
  },
  button: {
    marginBottom: 20,
  },
});

export default SignIn;
