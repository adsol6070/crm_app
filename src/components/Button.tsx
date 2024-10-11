import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { theme } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  containerStyle,
  loading,
  loadingText,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPress={loading ? undefined : onPress}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.COLORS.white} />
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        ) : (
          <Text style={styles.titleText}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    width: "100%",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.black,
  },
  titleText: {
    color: theme.COLORS.white,
    textTransform: "uppercase",
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 10,
    color: theme.COLORS.white,
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 16,
  },
});

export default Button;
