import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dashboardService } from '../../api/dashboard';
import { theme } from '../../constants/theme';

const LeadHalfYearlyReport = ({ refreshKey }: any) => {
  const [halfYearlyReport, setHalfYearlyReport] = useState<any>([]);

  const currentDate = moment();
  const startDate = currentDate.clone().subtract(5, 'months').startOf('month');
  const endDate = currentDate.clone().endOf('month');
  
  const screenWidth = Dimensions.get('window').width;
  const startDateText = startDate.format('MMM YYYY');
  const endDateText = endDate.format('MMM YYYY');
  
  const getHalfYearlyReportData = async () => {
    try {
      const startOfMonth = startDate;
      const endOfMonth = endDate;

      const response: any = await dashboardService.getLeadReportBasedTime(startOfMonth, endOfMonth);

      const aggregatedData = response.reduce((acc: any, item: any) => {
        const monthLabel = moment(item.date).format('MMM YYYY');
        if (!acc[monthLabel]) {
          acc[monthLabel] = {
            name: monthLabel,
            population: 0,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
          };
        }
        acc[monthLabel].population += parseInt(item.lead_count, 10);
        return acc;
      }, {});

      const processedData = Object.values(aggregatedData);
      setHalfYearlyReport(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getHalfYearlyReportData();
  }, [refreshKey]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Leads Created in the Last 6 Months</Text>
        <Text style={styles.time}>
         ({startDateText} - {endDateText})
        </Text>
        <PieChart
          data={halfYearlyReport} 
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#2c3e50',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 14,
              fontWeight: 'bold',
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'left',
    color: '#333',
    ...theme.FONTS.Mulish_600SemiBold
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
    color: '#666', 
    ...theme.FONTS.Mulish_400Regular
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});

export default LeadHalfYearlyReport;
