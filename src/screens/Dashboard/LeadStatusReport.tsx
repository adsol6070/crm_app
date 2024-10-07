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

    const statusLabels = ["Completed", "In Progress", "Pending", "New", "No Status"];
    const leadCounts = { completed: 0, inprogress: 0, pending: 0, new: 0, null: 0 };

    statusReport.forEach((item: any) => {
      const status = item.status || "null";
      leadCounts[status] += parseInt(item.lead_count, 10);
    });

    return {
      labels: statusLabels,
      datasets: [
        {
          data: [
            leadCounts.completed,
            leadCounts.inprogress,
            leadCounts.pending,
            leadCounts.new,
            leadCounts.null,
          ],
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
        height={320} 
        fromZero={true}
        showBarTops={true}
        chartConfig={{
          propsForLabels: {
            fontFamily: "Mulish_400Regular",
            fontSize: 14,
          },
          backgroundColor: "#4CAF50",
          backgroundGradientFrom: "#4CAF50",
          backgroundGradientTo: "#2E7D32",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
            paddingRight: 24,
          },
          propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: "#e3e3e3",
          },
          barPercentage: 0.8,
          paddingTop: 20, 
        }}
        yAxisLabel=""
        yAxisSuffix=""
        verticalLabelRotation={30}
        horizontalLabelRotation={0}
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 24,
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
    color: "#333", 
  },
});

export default LeadStatusReport;
