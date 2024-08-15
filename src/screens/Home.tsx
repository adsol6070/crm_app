import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dashboard } from "./Dashboard/";
import { ScrollView } from "react-native-gesture-handler";
import { components } from "../components";

const Home = () => {
  const renderHeader = () => {
    return (
      <components.Header
        title="Home"
      />
    );
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
  }

  return (
    <SafeAreaView style={{ marginBottom: 50 }}>
      <ScrollView>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
