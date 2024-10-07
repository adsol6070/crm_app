import React, { useState } from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { components } from '../../components';
import { constants } from '../../constants';
import { Controller, useForm } from 'react-hook-form';
import { userService } from '../../api/user1';

const { theme } = constants;

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required").trim(),
});

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await userService.forgetPassword(data)
      Alert.alert("Reset password link send successfully.")
      reset();
    } catch (error) {
      Alert.alert("Failed to send recovery email. Please try again.")
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = (): JSX.Element => {
    return <components.Header title="Forgot password" goBack={true} />;
  };

  const renderContent = (): JSX.Element => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instructionText}>
          Please enter your email address. You will receive a link to create a
          new password via email.
        </Text>
        <View style={styles.inputDesign}>
           <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <components.InputField
                title="Email"
                placeholder="example@mail.com"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.email?.message}
              />
            )}
          />
          </View>
          <components.Button
          title={loading ? <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.COLORS.white} />
          <Text style={styles.loadingText}>Sending...</Text>
        </View>: "Send"}
          onPress={handleSubmit(onSubmit)}
          disabled={loading} 
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  } as ViewStyle,
  scrollViewContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingVertical: 30,
  },
  instructionText: {
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
    lineHeight: 16 * 1.7,
    marginBottom: 10,
  } as TextStyle,
  inputDesign: {
    marginVertical: 10
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

export default ForgotPassword;
