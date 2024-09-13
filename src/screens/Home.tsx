import { View, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dashboard } from "./Dashboard/";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { components } from "../components";
import { theme } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import Header1 from "../components/Header1";

const Home = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey((prevKey) => prevKey + 1);
    setRefreshing(false);
  };

  const renderHeader = () => {
    return <components.Header title="Home" burger={true} />;
  };

  const renderContent = () => {
    return (
      <View style={{ paddingBottom: 50 }}>
        <Dashboard.DetailCard refreshKey={refreshKey} />
        <Dashboard.LeadStatusReport refreshKey={refreshKey} />
        <Dashboard.LeadSourceReport refreshKey={refreshKey} />
        <Dashboard.LeadWeekReport refreshKey={refreshKey} />
        <Dashboard.LeadMonthReport refreshKey={refreshKey} />
        <Dashboard.LeadHalfYearlyReport refreshKey={refreshKey} />
        <Dashboard.LeadYearlyReport refreshKey={refreshKey} />
        <Dashboard.LeadCustomTimeReport refreshKey={refreshKey} />
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
