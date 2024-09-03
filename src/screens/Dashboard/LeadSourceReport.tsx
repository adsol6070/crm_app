import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dashboardService } from '../../api/dashboard';

const LeadSourceReport = ({ refreshKey }: any) => {
  const [sourceReport, setSourceReport] = useState<any>([]);

  const getSourceReportData = async () => {
    try {
      const response: any = await dashboardService.getSourceReport();

      const chartData = response.map((item: any, index: any) => ({
        name: item.source || 'Unknown', 
        population: parseInt(item.lead_count, 10),
        color: getColor(index),
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
      }));

      setSourceReport(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getColor = (index: any) => {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
    return colors[index % colors.length]; 
  };

  useEffect(() => {
    getSourceReportData();
  }, [refreshKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lead Source Report</Text>
      <PieChart
        data={sourceReport}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default LeadSourceReport;
