import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeadHalfYearlyReport = () => {
  // Get the current date
  const currentDate = moment();

  // Generate data for the previous 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const startDate = currentDate.clone().subtract(i, 'months').startOf('month');
    const endDate = startDate.clone().endOf('month');
    months.push({
      label: startDate.format('MMM YYYY'),
      population: Math.floor(Math.random() * 200) 
    });
  }

  // Data for the PieChart
  const data = months.map(month => ({
    name: month.label,
    population: month.population,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
    legendFontColor: '#7F7F7F',
    legendFontSize: 14
  }));

  const screenWidth = Dimensions.get('window').width;
  const startDateText = months[0].label;
  const endDateText = currentDate.format('MMM YYYY');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Leads Created in the Last 6 Months</Text>
        <Text style={styles.time}>
         ({startDateText} - {endDateText})
        </Text>
        <PieChart
          data={data}
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
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    color: '#333',
  },
  time: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
    color: '#666', 
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginHorizontal: 8,
  },
});

export default LeadHalfYearlyReport;
