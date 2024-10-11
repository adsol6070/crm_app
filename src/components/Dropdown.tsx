import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { v4 as uuidv4 } from "uuid";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  selectedValue: string | Date | undefined;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  label,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsVisible(false);
  };

  const selectedLabel = options.find(
    (option) => option.value === selectedValue
  )?.label;

  const buttonTextColor = selectedLabel
    ? theme.COLORS.black
    : theme.COLORS.lightGray;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <View style={styles.inputStyle}>
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>
            {selectedLabel || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#bbb" />
        </View>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isVisible}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <FlatList
                  data={options}
                  keyExtractor={() => uuidv4()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => handleSelect(item.value)}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: 5,
    zIndex: 1,
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 12,
    textTransform: "capitalize",
    color: theme.COLORS.gray1,
    lineHeight: 12 * 1.7,
  },
  inputStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownButton: {
    height: 50,
    paddingRight: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    paddingLeft: 30,
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    overflow: "hidden",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.lightGray,
  },
  optionText: {
    fontSize: 16,
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_400Regular,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
});

export default Dropdown;
