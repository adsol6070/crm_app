import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
}) => (
  <View style={styles.container}>
    <Ionicons name="search" size={24} color={theme.COLORS.black} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.secondaryWhite,
    height: 48,
    marginVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 22,
  },
  input: {
    width: "100%",
    height: "100%",
    marginHorizontal: 12,
  },
});

export default SearchBar;
