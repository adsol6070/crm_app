import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { svg } from "../svg";
import { MaterialIcons } from "@expo/vector-icons";

interface HeaderProps {
  containerStyle?: ViewStyle;
  burger?: boolean;
  title?: string;
  goBack?: boolean;
  border?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  containerStyle,
  burger,
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
      {burger && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 1,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{
              width: 45,
              height: 45,
              backgroundColor: theme.COLORS.lightGray,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 999,
            }}
          >
            <MaterialIcons name="menu" size={24} color={theme.COLORS.gray1} />
          </TouchableOpacity>
        </View>
      )}
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
