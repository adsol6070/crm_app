import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { dashboardService } from '../../api/dashboard';
import { theme } from '../../constants/theme';

const LeadWeekReport = ({ refreshKey }: any) => {
  const [weeklyReport, setWeeklyReport] = useState<any>(undefined);

  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');
  
  const getWeeklyReportData = async () => {
    try {
      const response: any = await dashboardService.getLeadReportBasedTime(startOfWeek, endOfWeek);
      setWeeklyReport(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getWeeklyReportData();
  }, [refreshKey]);

  const generateChartData = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dataMap: any = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    if (weeklyReport) {
      weeklyReport.forEach((report: any) => {
        const day = moment(report.date).format('ddd');
        if (dataMap[day] !== undefined) {
          dataMap[day] = parseInt(report.lead_count);
        }
      });
    }

    return {
      labels: daysOfWeek,
      datasets: [
        {
          data: daysOfWeek.map(day => dataMap[day]),
        },
      ],
    };
  };

  const data = generateChartData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Lead Report</Text>
      <Text style={styles.time}>({moment(startOfWeek).format('MMM D, YYYY')} - {moment(endOfWeek).format('MMM D, YYYY')})</Text>
      <BarChart
        data={data}
        width={Dimensions.get('window').width * 0.9}
        height={300}
        fromZero={true}
        showBarTops={true}
        chartConfig={{
          backgroundColor: '#2980b9',
          backgroundGradientFrom: '#2980b9',
          backgroundGradientTo: '#2980b9',
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
    marginBottom: 16,
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

export default LeadWeekReport;
