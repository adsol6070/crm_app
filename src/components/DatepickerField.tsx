import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet, TextInput, TextInputProps, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../constants/theme';

interface InputFieldProps extends TextInputProps {
    title?: string;
    placeholder?: string;
    containerStyle?: ViewStyle,
    customBorderColor?: string;   
    customBackgroundColor?: string; 
    error?: string; 
  }

const DatepickerField: React.FC<InputFieldProps> = ({
  title,
  placeholder,
  containerStyle,
  customBorderColor,
  customBackgroundColor,
  error,
}) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}
      <TouchableOpacity onPress={showDatepicker} style={[
        styles.inputContainer,
        { borderColor: customBorderColor || theme.COLORS.lightBlue1 },
        { backgroundColor: customBackgroundColor || theme.COLORS.white },
      ]}>
        <TextInput
          editable={false}
          style={styles.input}
          value={date ? date.toDateString() : ''}
          placeholder={placeholder}
          placeholderTextColor={theme.COLORS.lightGray}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
        {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  titleContainer: {
    position: 'absolute',
    top: -12,
    left: 20,
    zIndex: 99,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  titleText: {
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 12,
    textTransform: 'capitalize',
    color: theme.COLORS.gray1,
    lineHeight: 12 * 1.7,
  },
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    paddingLeft: 20,
    flex: 1,
    fontSize: 16,
    color: theme.COLORS.gray1,
    ...theme.FONTS.Mulish_400Regular,
    height: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    paddingHorizontal: 20,
    marginTop: 5,
  },
});

export default DatepickerField;
