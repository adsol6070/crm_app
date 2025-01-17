import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { constants } from "../../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { components } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../common/context/AuthContext";
import { Dialog, Portal, Button } from "react-native-paper";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .trim(),
  password: yup.string().required("Password is required"),
});

const { theme } = constants;

const SignIn = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await login(data);
      if (response == "Invalid email or password") {
        setErrorMessage("Invalid email or password");
        setVisible(true);
      } else {
        navigation.navigate("Main");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("An error occurred. Please try again.");
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const hideDialog = () => setVisible(false);

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
          <Text style={styles.subtitle}>Sign in to continue</Text>
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
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <components.Button
          title="Sign In"
          containerStyle={styles.button}
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          loadingText="Signing In..."
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
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title style={{ color: "red" }}>Login Failed!</Dialog.Title>
          <Dialog.Content>
            <Text>{errorMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: theme.SIZES.height * 0.05,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
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
    alignItems: "center",
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
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 10,
    color: theme.COLORS.white,
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 16,
  },
});

export default SignIn;
