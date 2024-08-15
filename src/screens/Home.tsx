import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <View
        style={{ flex: 1, backgroundColor: theme.COLORS.white, padding: 16 }}
      >
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{
            width: 45,
            height: 45,
            backgroundColor: theme.COLORS.secondaryWhite,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 999,
          }}
        >
          <MaterialIcons name="menu" size={24} color={theme.COLORS.gray1} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
