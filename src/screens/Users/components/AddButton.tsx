import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "../../../constants/theme";

interface AddButtonProps {
  onPress: () => void;
  text: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress, text }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <AntDesign name="pluscircleo" size={50} color={theme.COLORS.black} />
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
  },
});

export default AddButton;
