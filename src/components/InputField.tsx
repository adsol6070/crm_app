import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { svg } from "../svg";

interface InputFieldProps extends TextInputProps {
  title?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  check?: boolean;
  eyeOffSvg?: boolean;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  title,
  placeholder,
  containerStyle,
  secureTextEntry,
  keyboardType,
  check,
  eyeOffSvg,
  error,
  ...rest
}) => {
  return (
    <View
      style={{
        paddingLeft: 30,
        height: 50,
        width: "100%",
        borderWidth: 1,
        borderColor: error ? "red" : theme.COLORS.lightBlue1,
        borderRadius: 50,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        ...containerStyle,
      }}
    >
      <TextInput
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          ...theme.FONTS.Mulish_400Regular,
          fontSize: 16,
        }}
        keyboardType={keyboardType}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={theme.COLORS.lightGray}
        {...rest}
      />
      {title && (
        <View
          style={{
            position: "absolute",
            top: -12,
            left: 20,
            paddingHorizontal: 10,
            backgroundColor: theme.COLORS.white,
          }}
        >
          <Text
            style={{
              ...theme.FONTS.Mulish_600SemiBold,
              fontSize: 12,
              textTransform: "uppercase",
              color: theme.COLORS.gray1,
              lineHeight: 12 * 1.7,
            }}
          >
            {title}
          </Text>
        </View>
      )}
      {check && (
        <View style={{ paddingHorizontal: 20 }}>
          <svg.CheckSvg />
        </View>
      )}
      {eyeOffSvg && (
        <TouchableOpacity style={{ paddingHorizontal: 20 }}>
          <svg.EyeOffSvg />
        </TouchableOpacity>
      )}
      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            paddingHorizontal: 20,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;
