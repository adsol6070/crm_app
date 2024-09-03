import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  ScrollView,
  TextInputProps,
  StyleSheet,
} from "react-native";
import React, { useRef, useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { theme } from "../constants/theme";
import { svg } from "../svg";
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import DateTimePicker from '@react-native-community/datetimepicker';

interface InputFieldProps extends TextInputProps {
  title?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  check?: boolean;
  eyeOffSvg?: boolean;
  error?: any;
  dropdown?: boolean;
  items?: Array<{ label: string; value: string }>;
  selectedValue?: string;
  onValueChange?: (value: any, index: number) => void;
  multiline?: boolean;
  numberOfLines?: number;
  customBorderColor?: string;
  customBackgroundColor?: string;
  useRichTextEditor?: boolean;
  richEditorPlaceholder?: string;
  initialContent?: string;
  richEditorStyle?: ViewStyle;
  richEditorToolbarStyle?: ViewStyle;
  onRichTextChange?: (content: string) => void;
  datePicker?: boolean;
  clearContent?: boolean;
  onDateChange?: (date: Date) => void;
  disableFutureDates?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  title,
  placeholder,
  containerStyle,
  secureTextEntry = false,
  keyboardType,
  check,
  eyeOffSvg = false,
  error,
  dropdown = false,
  items = [],
  selectedValue,
  onValueChange,
  multiline = false,
  numberOfLines,
  customBorderColor,
  customBackgroundColor,
  useRichTextEditor = false,
  richEditorPlaceholder,
  richEditorStyle,
  richEditorToolbarStyle,
  onRichTextChange, 
  initialContent,
  clearContent,
  datePicker = false,
  onDateChange,
  disableFutureDates = false,
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const richText = useRef(null);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  if (clearContent) {
    richText.current?.setContentHTML('');
  }

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    if (onDateChange) {
      console.log('Selected Date:', currentDate); 
      onDateChange(currentDate);
    }
  };

  return (
    <View>
      {useRichTextEditor ? <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={{marginBottom: 10}}>{title}</Text>
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
            ]}
            style={[styles.toolbar]}
          />
          <RichEditor
            ref={richText}
            style={[styles.editor]}
            placeholder={placeholder}
            onChange={onRichTextChange}
            initialContentHTML={initialContent || ''}
          />
        </ScrollView> : <View
        style={{
          paddingLeft: 30,
          height: dropdown || multiline ? "auto" : 50,
          width: "100%",
          borderWidth: 1,
          borderColor:
            customBorderColor || (error ? "red" : theme.COLORS.lightBlue1),
          borderRadius: 5,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
          ...containerStyle,
        }}
      >
        {dropdown ? (
          <RNPickerSelect
            placeholder={{ label: placeholder || "Select...", value: "" }}
            items={items}
            onValueChange={onValueChange as (value: any, index: number) => void}
            value={selectedValue}
            style={{
              inputIOS: {
                flex: 1,
                height: 50,
                width: "100%",
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
              },
              inputAndroid: {
                flex: 1,
                height: 50,
                width: "100%",
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
              },
              placeholder: {
                color: theme.COLORS.lightGray,
              },
            }}
            useNativeAndroidPickerStyle={false}
          />
        ) : datePicker ? (
          <View
            style={{
              paddingLeft: 30,
              height: 50,
              width: "100%",
              borderRadius: 50,
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 10,
              ...containerStyle,
            }}
          >
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flex: 1 }}>
              <TextInput
                editable={false}
                style={{
                  flex: 1,
                  height: "100%",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  ...theme.FONTS.Mulish_400Regular,
                  fontSize: 16,
                  textAlignVertical: "center",
                  paddingVertical: 0,
                  color: theme.COLORS.gray1,
                }}
                value={date ? date.toDateString() : ''}
                placeholder={placeholder}
                placeholderTextColor={theme.COLORS.lightGray}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={disableFutureDates ? new Date() : undefined}
              />
            )}
          </View>
        ) : (
          <>
            <TextInput
              style={{
                flex: 1,
                height: multiline ? undefined : "100%",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                ...theme.FONTS.Mulish_400Regular,
                fontSize: 16,
                textAlignVertical: multiline ? "top" : "center",
                paddingVertical: multiline ? 10 : 0,
              }}
              keyboardType={keyboardType}
              placeholder={placeholder}
              secureTextEntry={isSecure}
              placeholderTextColor={theme.COLORS.lightGray}
              multiline={multiline}
              numberOfLines={numberOfLines}
              {...rest}
            />
            {eyeOffSvg && (
              <TouchableOpacity
                onPress={toggleSecureEntry}
                style={{ paddingHorizontal: 20 }}
              >
                {isSecure ? <svg.EyeOffSvg /> : <svg.EyeSvg />}
              </TouchableOpacity>
            )}
          </>
        )}

        {title && (
          <View
            style={{
              position: "absolute",
              top: -12,
              left: 20,
              paddingHorizontal: 10,
              backgroundColor: customBackgroundColor || theme.COLORS.white,
            }}
          >
            <Text
              style={{
                ...theme.FONTS.Mulish_600SemiBold,
                fontSize: 12,
                textTransform: "capitalize",
                color: theme.COLORS.gray1,
                lineHeight: 12 * 1.7,
              }}
            >
              {title}
            </Text>
          </View>
        )}
        {check && (
          <View style={{ paddingHorizontal: 20 }}>
            <svg.CheckSvg />
          </View>
        )}
      </View>}
      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            paddingHorizontal: 20,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    height: 280,
  },
  editor: {
    borderColor: theme.COLORS.lightBlue1,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 200,
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
  },
  toolbar: {
    borderBottomColor: theme.COLORS.lightBlue1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default InputField;
