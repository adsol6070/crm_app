import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LeadData } from "../interfaces";
import { theme } from "../../../../constants/theme";

interface LeadPreviewProps {
  data: LeadData;
}

const formatDate = (date: Date) => {
  const updatedDate = new Date(date);
  const day = String(updatedDate.getDate()).padStart(2, "0");
  const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
  const year = updatedDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const LeadPreview: React.FC<LeadPreviewProps> = ({ data }) => {
  return (
    <View>
      <Text style={styles.stepTitle}>View Lead Details</Text>
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Lead Preview</Text>
        <View style={styles.table}>
          {Object.keys(data).map((key, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableLabel}>
                {capitalizeFirstLetter(key.replace(/([A-Z])/g, " $1"))}:
              </Text>
              <Text style={styles.tableValue}>
                {key === "dob" ? formatDate(data[key]) : data[key] ?? "N/A"}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const styles = StyleSheet.create({
  stepTitle: {
    fontSize: 17,
    marginBottom: 10,
    ...theme.FONTS.Mulish_700Bold,
  },
  previewItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  previewLabel: {
    fontWeight: "bold",
    marginRight: 10,
  },
  previewValue: {
    flex: 1,
  },
  previewContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  previewTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
    ...theme.FONTS.Mulish_700Bold,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  tableLabel: {
    fontSize: 16,
    color: "#555",
    ...theme.FONTS.Mulish_700Bold,
  },
  tableValue: {
    fontSize: 16,
    color: "#333",
    ...theme.FONTS.Mulish_400Regular,
  },
});

export default LeadPreview;
