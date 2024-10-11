import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LeadData } from "../interfaces";
import { theme } from "../../../../constants/theme";
import { capitalizeFirstLetter } from "../../../../utils/CapitalizeFirstLetter";
import { formatRoleDisplayName } from "../../../../utils/FormatRoleDisplayName";

interface LeadPreviewProps {
  data: LeadData;
  countryCode: string;
}

const formatDate = (date: Date) => {
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }
  const updatedDate = new Date(date);
  const day = String(updatedDate.getDate()).padStart(2, "0");
  const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
  const year = updatedDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const TableRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableLabel}>{label}:</Text>
    <Text style={styles.tableValue}>{value}</Text>
  </View>
);

const LeadPreview: React.FC<LeadPreviewProps> = ({ data, countryCode }) => {
  const renderValue = (key: string, value: any) => {
    switch (key) {
      case "dob":
      case "passportExpiry":
      case "followUpDates":
        return formatDate(value);
      case "phone":
        return `${countryCode}${value}`;
      case "visaCategory":
        return formatRoleDisplayName(value);
      default:
        return capitalizeFirstLetter(value) ?? "N/A";
    }
  };

  return (
    <View>
      <Text style={styles.stepTitle}>View Lead Details</Text>
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Lead Preview</Text>
        <View style={styles.table}>
          {Object.keys(data).map((key, index) => (
            <TableRow
              key={index}
              label={capitalizeFirstLetter(key.replace(/([A-Z])/g, " $1"))}
              value={renderValue(key, data[key])}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

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
