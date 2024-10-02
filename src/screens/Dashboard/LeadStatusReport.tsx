import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { dashboardService } from "../../api/dashboard";
import { theme } from "../../constants/theme";

const LeadStatusReport = ({ refreshKey }: any) => {
  const [statusReport, setStatusReport] = useState<any>(undefined);

  const getStatusReportData = async () => {
    try {
      const response: any = await dashboardService.getStatusReport();
      setStatusReport(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getStatusReportData();
  }, [refreshKey]);

  const getChartData = () => {
    if (!statusReport) return { labels: [], datasets: [{ data: [] }] };

    const statusLabels = ["completed", "inprogress", "pending", "null"];
    const leadCounts = [0, 0, 0, 0];

    statusReport.forEach((item: any) => {
      const index = statusLabels.indexOf(item.status || "null");
      if (index !== -1) {
        leadCounts[index] += parseInt(item.lead_count, 10);
      }
    });

    return {
      labels: ["Completed", "In Progress", "Pending", "New"],
      datasets: [
        {
          data: leadCounts,
        },
      ],
    };
  };

  const chartData = getChartData();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lead Status Report</Text>
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 32}
        height={220}
        fromZero={true}
        showBarTops={true}
        chartConfig={{
          propsForLabels: {
            fontFamily: "Mulish_400Regular",
            fontSize: 14,
          },
          backgroundColor: "#e67e22",
          backgroundGradientFrom: "#e67e22",
          backgroundGradientTo: "#e67e22",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeWidth: 0,
            stroke: "#e3e3e3",
          },
        }}
        yAxisLabel=""
        yAxisSuffix=""
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    ...theme.FONTS.Mulish_600SemiBold,
  },
});

export default LeadStatusReport;
