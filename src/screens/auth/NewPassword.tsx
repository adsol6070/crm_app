import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { constants } from '../../constants';
import { components } from '../../components';

// Define your navigation stack types
type RootStackParamList = {
  NewPassword: undefined;
  ForgotPasswordSentEmail: undefined;
};

type NewPasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewPassword'
>;

const { theme } = constants;

const NewPassword: React.FC = () => {
  const navigation = useNavigation<NewPasswordNavigationProp>();

  const renderHeader = (): JSX.Element => {
    return <components.Header title="Reset password" goBack={true} />;
  };

  const renderContent = (): JSX.Element => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.instructionText}>
          Enter new password and confirm.
        </Text>
        <components.InputField
          title="new password"
          secureTextEntry={true}
          placeholder="••••••••"
          containerStyle={{ marginBottom: 20 }}
          eyeOffSvg={true}
        />
        <components.InputField
          title="confirm password"
          secureTextEntry={true}
          placeholder="••••••••"
          containerStyle={{ marginBottom: 20 }}
          eyeOffSvg={true}
        />
        <components.Button
          title="change password"
          onPress={() => navigation.navigate('ForgotPasswordSentEmail')}
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
    color: theme.COLORS.black,
    lineHeight: 16 * 1.7,
    marginBottom: 40,
  } as TextStyle,
});

export default NewPassword;
