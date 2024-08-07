import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";

import { components } from '../../components';
import { constants } from '../../constants';

// Define your navigation stack types
type RootStackParamList = {
  ForgotPassword: undefined;
  NewPassword: undefined;
};

type ForgotPasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;
const { theme } = constants;

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();

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
        <components.InputField
          title="Email"
          placeholder="example@mail.com"
          containerStyle={{ marginBottom: 20 }}
        />
        <components.Button
          title="send"
          onPress={() => navigation.navigate('NewPassword')}
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
    marginBottom: 40,
  } as TextStyle,
});

export default ForgotPassword;
