import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

const LeadYearlyReport = () => {
  const startOfYear = moment().startOf('year').format('MMM D, YYYY');
  const endOfYear = moment().endOf('year').format('MMM D, YYYY');

  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        data: [
          120, 150, 80, 60, 90, 110, 
          130, 140, 100, 70, 90, 120
        ],
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width;

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Yearly Lead Report</Text>
        <Text style={styles.time}>({startOfYear} - {endOfYear})</Text>
        <LineChart
          data={data}
          width={screenWidth - 32}
          height={220}
          withVerticalLines={false}
          withHorizontalLines={true}
          withDots={true}
          withShadow={false}
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
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});

export default LeadYearlyReport;
