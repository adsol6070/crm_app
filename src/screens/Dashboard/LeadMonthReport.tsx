import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import moment from 'moment';
import { dashboardService } from '../../api/dashboard';
import { theme } from '../../constants/theme';

const LeadMonthReport = ({ refreshKey }: any) => {
  const [monthlyReport, setMonthlyReport] = useState<any>([]);

  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');
  
  const getMonthlyReportData = async () => {
    try {
      const response: any = await dashboardService.getLeadReportBasedTime(startOfMonth, endOfMonth);
      setMonthlyReport(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getMonthlyReportData();
  }, [refreshKey]);

  const generateChartData = () => {
    const weeks: any = {
      'Week 1': 0,
      'Week 2': 0,
      'Week 3': 0,
      'Week 4': 0,
      'Week 5': 0,
    };

    if (monthlyReport) {
      monthlyReport.forEach((report: any) => {
        const weekOfMonth = moment(report.date).week() - moment(report.date).startOf('month').week() + 1;
        const weekLabel = `Week ${weekOfMonth}`;
        if (weeks[weekLabel] !== undefined) {
          weeks[weekLabel] += parseInt(report.lead_count);
        }
      });
    }

    return {
      labels: Object.keys(weeks),
      datasets: [
        {
          data: Object.values(weeks),
        },
      ],
    };
  };

  const data = generateChartData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Lead Report</Text>
      <Text style={styles.time}>({moment(startOfMonth).format('MMM D, YYYY')} - {moment(endOfMonth).format('MMM D, YYYY')})</Text>
      <BarChart
        data={data}
        width={Dimensions.get('window').width * 0.9}
        height={300}
        fromZero={true}
        showBarTops={true}
        chartConfig={{
          backgroundColor: '#2c3e50',
          backgroundGradientFrom: '#2c3e50',
          backgroundGradientTo: '#2c3e50',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
            marginVertical: 8,
          },
          propsForBackgroundLines: {
            strokeWidth: 0,
            stroke: "#e3e3e3",
          },
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
});

export default LeadMonthReport;
