import { View, Text, TextInput, TouchableOpacity, ViewStyle, TextStyle, StyleProp, TextInputProps } from "react-native";
import React from "react";
import Svg, { Path } from 'react-native-svg';
import { theme } from ".././constants/theme";
import CheckSvg from "../svg/CheckSvg";
import EyeOffSvg from "../svg/EyeOffSvg";

interface InputFieldProps extends TextInputProps {
    title?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    check?: boolean;
    eyeOffSvg?: boolean;
    error?: string; 
}

const InputField: React.FC<InputFieldProps> = ({
    title,
    placeholder,
    icon,
    containerStyle,
    secureTextEntry,
    keyboardType,
    check,
    eyeOffSvg = false,
    ...rest
}) => {
    return (
        <View
            style={[
                {
                    paddingLeft: 30,
                    height: 50,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: theme.COLORS.lightBlue1,
                    borderRadius: 50,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                },
                containerStyle as ViewStyle,
            ]}
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
                    <CheckSvg />
                </View>
            )}
            {eyeOffSvg && (
                <TouchableOpacity style={{ paddingHorizontal: 20 }}>
                    <EyeOffSvg />
                </TouchableOpacity>
            )}
            {icon && (
                <TouchableOpacity
                    style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {icon}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default InputField;
