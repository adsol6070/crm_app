import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

type AntDesignIconNames = keyof typeof AntDesign.glyphMap;

interface IHeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  onActionPress?: () => void;
  actionIcon?: AntDesignIconNames;
  actionIconSize?: number;
}

const Header1: React.FC<IHeaderProps> = ({
  title,
  showMenuButton,
  showBackButton,
  onMenuPress,
  onBackPress,
  onActionPress,
  actionIcon,
  actionIconSize = 20,
}) => {
  const shouldApplyFlex1 = !actionIcon;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: onActionPress ? "space-between" : "center",
        paddingHorizontal: 22,
        paddingTop: 22,
        paddingBottom: 10,
        backgroundColor: theme.COLORS.white,
        marginBottom: 5,
        elevation: 4,
      }}
    >
      {showMenuButton && (
        <TouchableOpacity
          onPress={onMenuPress}
          style={{ flex: shouldApplyFlex1 ? 1 : undefined }}
        >
          <MaterialIcons name="menu" size={24} color={theme.COLORS.black} />
        </TouchableOpacity>
      )}
      {showBackButton && (
        <TouchableOpacity
          onPress={onBackPress}
          style={{ flex: shouldApplyFlex1 ? 1 : undefined }}
        >
          <MaterialIcons
            name="keyboard-arrow-left"
            size={24}
            color={theme.COLORS.black}
          />
        </TouchableOpacity>
      )}
      <Text style={{ ...theme?.FONTS?.H4 }}>{title}</Text>
      {onActionPress && actionIcon && (
        <TouchableOpacity onPress={onActionPress}>
          <AntDesign
            name={actionIcon}
            size={actionIconSize}
            color={theme.COLORS.black}
          />
        </TouchableOpacity>
      )}
      {!onActionPress && !actionIcon && <View style={{ flex: 1 }} />}
    </View>
  );
};

export default Header1;
