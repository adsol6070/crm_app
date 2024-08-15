import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const LeadCustomTimeReport = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [chartType, setChartType] = useState('line');
  
  const onDateChange = (event: any, selectedDate: any, isStartDate: boolean) => {
    if (selectedDate) {
      if (isStartDate) {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#f5f5f5',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lead Custom Range Time Report</Text>
      <View style={styles.dateContainer}>
        <Button title={`Start Date: ${startDate.toDateString()}`} onPress={() => setShowStartDatePicker(true)} />
        {showStartDatePicker && (
          <DateTimePicker
            testID="startDatePicker"
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => onDateChange(event, date, true)}
          />
        )}
      </View>
      <View style={styles.dateContainer}>
        <Button title={`End Date: ${endDate.toDateString()}`} onPress={() => setShowEndDatePicker(true)} />
        {showEndDatePicker && (
          <DateTimePicker
            testID="endDatePicker"
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => onDateChange(event, date, false)}
          />
        )}
      </View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Select Chart Type:</Text>
        <Picker
          selectedValue={chartType}
          style={styles.picker}
          onValueChange={(itemValue: any) => setChartType(itemValue)}
        >
          <Picker.Item label="Line Chart" value="line" />
          <Picker.Item label="Bar Chart" value="bar" />
          <Picker.Item label="Pie Chart" value="pie" />
        </Picker>
        {chartType === 'line' && (
          <LineChart
            data={chartData}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        )}
        {chartType === 'bar' && (
          <BarChart
            data={chartData}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix=""
            style={styles.chart}
          />
        )}
        {chartType === 'pie' && (
          <PieChart
            data={chartData.datasets[0].data.map((value, index) => ({
              name: chartData.labels[index],
              population: value,
              color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
              legendFontColor: '#7F7F7F',
              legendFontSize: 15
            }))}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  dateContainer: {
    marginBottom: 16,
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default LeadCustomTimeReport;
