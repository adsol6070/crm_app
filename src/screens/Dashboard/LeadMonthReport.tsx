import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

const LeadMonthReport = () => {
  const startOfMonth = moment().startOf('month').format('MMM D, YYYY');
  const endOfMonth = moment().endOf('month').format('MMM D, YYYY');

  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], 
    datasets: [
      {
        data: [120, 150, 80, 60, 90], 
      },
    ],
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Monthly Lead Report</Text>
        <Text style={styles.time}>({startOfMonth} - {endOfMonth})</Text>
        <BarChart
          data={data}
          width={Dimensions.get('window').width * 0.9}
          height={220}
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
    marginBottom: 8,
    textAlign: 'left',
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
  },
});

export default LeadMonthReport;
