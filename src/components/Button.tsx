import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { theme } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  containerStyle,
  loading,
}) => {
  return (
    <View style={{ ...containerStyle, width: "100%" }}>
      <TouchableOpacity
        style={{
          width: "100%",
          height: 50,
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.COLORS.black,
        }}
        onPress={loading ? undefined : onPress}
        disabled={loading}
      >
        <Text
          style={{
            color: theme.COLORS.white,
            textTransform: "uppercase",
            ...theme.FONTS.Mulish_600SemiBold,
            fontSize: 14,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
