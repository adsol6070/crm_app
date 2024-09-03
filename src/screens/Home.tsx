import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dashboard } from "./Dashboard/";
import { ScrollView , RefreshControl } from "react-native-gesture-handler";
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
      <View>
        <Dashboard.DetailCard refreshKey={refreshKey}/>
        <Dashboard.LeadStatusReport refreshKey={refreshKey}/>
        <Dashboard.LeadSourceReport refreshKey={refreshKey}/>
        <Dashboard.LeadWeekReport refreshKey={refreshKey}/>
        <Dashboard.LeadMonthReport refreshKey={refreshKey}/>
        <Dashboard.LeadHalfYearlyReport refreshKey={refreshKey}/>
        <Dashboard.LeadYearlyReport refreshKey={refreshKey}/>
        <Dashboard.LeadCustomTimeReport refreshKey={refreshKey}/>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ marginBottom: 100 }}>
      {renderHeader()}
      <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

export default Home;
