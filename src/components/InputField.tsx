import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from "react-native";
import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
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
  dropdown?: boolean;
  items?: Array<{ label: string; value: string }>;
  selectedValue?: string;
  onValueChange?: (value: any, index: number) => void;
  multiline?: boolean;
  numberOfLines?: number;
  customBorderColor?: string;
  customBackgroundColor?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  title,
  placeholder,
  containerStyle,
  secureTextEntry = false,
  keyboardType,
  check,
  eyeOffSvg = false,
  error,
  dropdown = false,
  items = [],
  selectedValue,
  onValueChange,
  multiline = false,
  numberOfLines,
  customBorderColor,
  customBackgroundColor,
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View>
      <View
        style={{
          paddingLeft: 30,
          height: dropdown && multiline ? "auto" : 50,
          width: "100%",
          borderWidth: 1,
          borderColor:
            customBorderColor || (error ? "red" : theme.COLORS.lightBlue1),
          borderRadius: 50,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
          ...containerStyle,
        }}
      >
        {dropdown ? (
          <RNPickerSelect
            placeholder={{ label: placeholder || "Select...", value: "" }}
            items={items}
            onValueChange={onValueChange as (value: any, index: number) => void}
            value={selectedValue}
            style={{
              inputIOS: {
                flex: 1,
                height: 50,
                width: "100%",
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
              },
              inputAndroid: {
                flex: 1,
                height: 50,
                width: "100%",
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
              },
              placeholder: {
                color: theme.COLORS.lightGray,
              },
            }}
            useNativeAndroidPickerStyle={false}
          />
        ) : (
          <>
            <TextInput
              style={{
                flex: 1,
                height: multiline ? undefined : "100%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                textAlignVertical: multiline ? "top" : "center",
                paddingVertical: multiline ? 10 : 0,
              }}
              keyboardType={keyboardType}
              placeholder={placeholder}
              secureTextEntry={isSecure}
              placeholderTextColor={theme.COLORS.lightGray}
              multiline={multiline}
              numberOfLines={numberOfLines}
              {...rest}
            />
            {eyeOffSvg && (
              <TouchableOpacity
                onPress={toggleSecureEntry}
                style={{ paddingHorizontal: 20 }}
              >
                {isSecure ? <svg.EyeOffSvg /> : <svg.EyeSvg />}
              </TouchableOpacity>
            )}
          </>
        )}

        {title && (
          <View
            style={{
              position: "absolute",
              top: -12,
              left: 20,
              paddingHorizontal: 10,
              backgroundColor: customBackgroundColor || theme.COLORS.white,
            }}
          >
            <Text
              style={{
                ...theme.FONTS.Mulish_600SemiBold,
                fontSize: 12,
                textTransform: "capitalize",
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
      </View>
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
