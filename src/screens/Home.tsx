import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dashboard } from "./Dashboard/";
import { ScrollView } from "react-native-gesture-handler";
import { components } from "../components";

/* <View
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
      </View> */

const Home = () => {
  const renderHeader = () => {
    return <components.Header title="Home" burger={true} />;
  };

  const renderContent = () => {
    return (
      <View>
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
    <SafeAreaView style={{ marginBottom: 50 }}>
      {renderHeader()}
      <ScrollView>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

export default Home;
