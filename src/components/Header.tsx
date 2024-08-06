import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { svg } from "../svg";

interface HeaderProps {
  containerStyle?: ViewStyle;
  title?: string;
  goBack?: boolean;
  border?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  containerStyle,
  title,
  goBack,
  border,
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 42,
        ...containerStyle,
        borderBottomWidth: border ? 1 : 0,
        borderBottomColor: theme.COLORS.lightBlue1,
      }}
    >
      {goBack && (
        <View
          style={{
            position: "absolute",
            left: 0,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
            onPress={() => navigation.goBack()}
          >
            <svg.GoBackSvg />
          </TouchableOpacity>
        </View>
      )}
      {title && (
        <Text
          style={{
            textAlign: "center",
            textTransform: "capitalize",
            ...theme.FONTS.H4,
            color: theme.COLORS.black,
          }}
        >
          {title}
        </Text>
      )}
    </View>
  );
};

export default Header;
