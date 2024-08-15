import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const StartEndDatePicker = () => {
  // State to manage the date picker visibility and selected dates
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Function to handle date changes
  const onDateChange = (event: any, selectedDate: any, isStartDate: any) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lead Custom Time Report</Text>
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
});

export default StartEndDatePicker;
