import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

interface SubItem {
  label: string;
  screen: string;
}

interface DrawerItemWithSubItemsProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  subItems: SubItem[];
}

const DrawerItemWithSubItems: React.FC<DrawerItemWithSubItemsProps> = ({
  label,
  icon,
  subItems,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const navigation = useNavigation();

  const handlePress = (screen?: string) => {
    setExpanded(!expanded);
    if (screen) {
      navigation.navigate(screen as never);
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.drawerItem} onPress={() => handlePress()}>
        <Ionicons name={icon} size={24} color="#000" />
        <Text style={styles.drawerLabel}>{label}</Text>
        <Ionicons
          name={expanded ? "chevron-down-outline" : "chevron-up-outline"}
          size={24}
          color="#000"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.subItems}>
          {subItems.map((subItem, index) => (
            <TouchableOpacity
              key={index}
              style={styles.subItem}
              onPress={() => handlePress(subItem.screen)}
            >
              <Text style={styles.subItemLabel}>{subItem.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerLabel: {
    marginLeft: 20,
    color: theme.COLORS.black,
    fontFamily: "Mulish_400Regular",
  },
  subItems: {
    paddingLeft: 40,
  },
  subItem: {
    paddingVertical: 10,
  },
  subItemLabel: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Mulish_400Regular",
    marginLeft: 20,
  },
  arrowIcon: {
    marginLeft: "auto",
  },
});

export default DrawerItemWithSubItems;
