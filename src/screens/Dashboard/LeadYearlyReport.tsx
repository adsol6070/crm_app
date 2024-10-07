import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import moment from 'moment';
import { dashboardService } from '../../api/dashboard';
import { theme } from '../../constants/theme';

const LeadYearlyReport = ({ refreshKey }: any) => {
  const [yearlyReport, setYearlyReport] = useState<any>([]);

  const startOfYear = moment().startOf('year').format('YYYY-MM-DD');
  const endOfYear = moment().endOf('year').format('YYYY-MM-DD');

  const getYearlyReportData = async () => {
    try {
      const response: any = await dashboardService.getLeadReportBasedTime(startOfYear, endOfYear);
      setYearlyReport(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getYearlyReportData();
  }, [refreshKey]);

  const aggregateMonthlyData = () => {
    const monthlyData = Array(12).fill(0);
    yearlyReport.forEach((report: any) => {
      const monthIndex = moment(report.date).month();
      monthlyData[monthIndex] += parseInt(report.lead_count);
    });

    return monthlyData;
  };

  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        data: aggregateMonthlyData(), // Use the aggregated data
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yearly Lead Report</Text>
      <Text style={styles.time}>({moment(startOfYear).format('MMM D, YYYY')} - {moment(endOfYear).format('MMM D, YYYY')})</Text>
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={300}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
        verticalLabelRotation={30}
        horizontalLabelRotation={0}
        chartConfig={{
          backgroundColor: '#2c3e50',
          backgroundGradientFrom: '#2c3e50',
          backgroundGradientTo: '#2c3e50',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeWidth: 0.5,
            stroke: "#e3e3e3",
          },
        }}
        style={styles.chart}
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
    marginBottom: 8,
    textAlign: 'left',
    ...theme.FONTS.Mulish_600SemiBold
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
    ...theme.FONTS.Mulish_400Regular
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});

export default LeadYearlyReport;
