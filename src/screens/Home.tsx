import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dashboard } from "./Dashboard/";
import { ScrollView } from "react-native-gesture-handler";
import { components } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import Header1 from "../components/Header1";

const Home = () => {
  const navigation = useNavigation();

  const renderContent = () => {
    return (
      <View style={{ paddingBottom: Platform.OS === "ios" ? 90 : 60 }}>
        <Dashboard.DetailCard />
        <Dashboard.LeadStatusReport />
        <Dashboard.LeadSourceReport />
        <Dashboard.LeadWeekReport />
        <Dashboard.LeadMonthReport />
        <Dashboard.LeadHalfYearlyReport />
        <Dashboard.LeadYearlyReport />
        <Dashboard.LeadCustomTimeReport />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <Header1
        title="Home"
        showMenuButton={true}
        onMenuPress={() => navigation.toggleDrawer()}
      />
      <ScrollView>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

export default Home;
