import React from 'react';
import { Text, ScrollView, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { components } from '../../components';
import { constants } from '../../constants';
import { svg } from '../../svg';

// Define your navigation stack types
type RootStackParamList = {
  ForgotPasswordSentEmail: undefined;
  SignIn: undefined;
};

type ForgotPasswordSentEmailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPasswordSentEmail'
>;

const { theme } = constants;

const ForgotPasswordSentEmail: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordSentEmailNavigationProp>();

  const renderContent = (): JSX.Element => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.svgContainer}>
          <svg.KeySvg />
        </View>
        <Text style={styles.titleText}>
          Your password has{"\n"}been reset!
        </Text>
        <components.Button
          title="done"
          containerStyle={styles.buttonContainer}
          onPress={() => navigation.navigate('SignIn')}
        />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  svgContainer: {
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  line: {
    marginBottom: 14,
  },
  titleText: {
    textAlign: 'center',
    ...theme.FONTS.H2,
    color: theme.COLORS.black,
    marginBottom: 14,
  } as TextStyle,
  descriptionText: {
    textAlign: 'center',
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.gray1,
    lineHeight: 16 * 1.7,
    marginBottom: 30,
  } as TextStyle,
  buttonContainer: {
    marginBottom: 30,
  },
});

export default ForgotPasswordSentEmail;
