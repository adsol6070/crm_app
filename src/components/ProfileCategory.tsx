import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import React from "react";

import { constants } from "../constants";
import { svg } from "../svg";

interface ProfileCategoryProps {
    title: string;
    containerStyle?: ViewStyle;
    icon: React.ReactNode;
    categoryNavigation?: boolean;
    onPress?: () => void;
}

const ProfileCategory: React.FC<ProfileCategoryProps> = ({
    title,
    containerStyle,
    icon,
    categoryNavigation = true,
    onPress,
}) => {
    const { theme } = constants;
    return (
        <TouchableOpacity
            style={{
                borderTopWidth: 1,
                borderTopColor: theme.COLORS.lightBlue1,
                paddingHorizontal: 20,
                paddingVertical: 10,
                ...containerStyle,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
            }}
            onPress={onPress}
        >
            <View
                style={{
                    width: 50,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: theme.COLORS.lightBlue1,
                    borderRadius: 25,
                    marginRight: 14,
                }}
            >
                {icon}
            </View>
            <Text
                style={{
                    flex: 1,
                    ...theme.FONTS.H5,
                    color: theme.COLORS.black,
                }}
            >
                {title}
            </Text>
            {categoryNavigation && <svg.ProfileNavigation />}
        </TouchableOpacity>
    );
};

export default ProfileCategory;