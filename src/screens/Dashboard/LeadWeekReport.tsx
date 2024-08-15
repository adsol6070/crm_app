import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

const LeadWeekReport = () => {
  // Get current date and calculate the start and end of the week
  const startOfWeek = moment().startOf('week').format('MMM D, YYYY');
  const endOfWeek = moment().endOf('week').format('MMM D, YYYY');

  // Sample data for the bar chart
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 
    datasets: [
      {
        data: [30, 45, 28, 80, 99, 43, 56], 
      },
    ],
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Lead Report</Text>
        <Text style={styles.time}>({startOfWeek} - {endOfWeek})</Text>
        <BarChart
          data={data}
          width={Dimensions.get('window').width * 0.9}
          height={220}
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
    textAlign: 'left', 
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left', 
  },
});

export default LeadWeekReport;
