import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const LeadSourceReport = () => {
  // Sample data for the pie chart
  const data = [
    {
      name: 'Source A',
      population: 215000,
      color: '#f00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Source B',
      population: 280000,
      color: '#0f0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Source C',
      population: 270000,
      color: '#00f',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Source D',
      population: 500000,
      color: '#ff0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
  ];

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Lead Source Report</Text>
        <PieChart
          data={data}
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
