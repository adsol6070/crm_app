import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import React, { useState } from "react";
import RNPickerSelect from "react-native-picker-select";
import { theme } from "../constants/theme";
import { svg } from "../svg";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CountryPicker } from "react-native-country-codes-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useActionSheet } from "@expo/react-native-action-sheet";

interface InputFieldProps extends TextInputProps {
  date?: string | undefined;
  title?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  check?: boolean;
  eyeOffSvg?: boolean;
  error?: string;
  image?: boolean;
  dropdown?: boolean;
  items?: Array<{ label: string; value: string }>;
  selectedValue?: string;
  onValueChange?: (value: any, index: number) => void;
  multiline?: boolean;
  numberOfLines?: number;
  customBorderColor?: string;
  customBackgroundColor?: string;
  onImageSelect?: (image: ImagePicker.ImagePickerAsset) => void;
  imageUri?: string;
  imageLabel?: string;
  countryCode?: string;
  setCountryCode?: any;
  datePicker?: boolean;
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
  image = false,
  items = [],
  selectedValue,
  onValueChange,
  multiline = false,
  numberOfLines,
  customBorderColor,
  customBackgroundColor,
  onImageSelect,
  imageUri,
  imageLabel,
  countryCode,
  setCountryCode,
  datePicker = false,
  date,
  onDateChange,
  disableFutureDates = false,
  ...rest
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [show, setShow] = useState(false);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (event.type === "set" && selectedDate) {
      setShowDatePicker(false);
      onDateChange && onDateChange(selectedDate);
    } else if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  const handleImageSelect = async (index: number) => {
    let result;
    if (index === 1) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else if (index === 2) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (result && !result.canceled) {
      onImageSelect?.(result.assets[0]);
    }
  };

  const showImageActionSheet = () => {
    const options = ["Cancel", "Take Photo", "Choose from Library"];
    const cancelButtonIndex = 0;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex !== cancelButtonIndex) {
          handleImageSelect(buttonIndex);
        }
      }
    );
  };

  const imageContainerHeight = imageUri ? 200 : 50;

  return (
    <View>
      <View
        style={[
          styles.container,
          {
            height: dropdown || multiline || image ? "auto" : 50,
            borderColor:
              customBorderColor || (error ? "red" : theme.COLORS.lightBlue1),
          },
          containerStyle,
        ]}
      >
        {dropdown ? (
          <RNPickerSelect
            placeholder={{ label: placeholder || "Select...", value: "" }}
            items={items}
            onValueChange={onValueChange as (value: any, index: number) => void}
            value={selectedValue}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
          />
        ) : image ? (
          <>
            <TouchableOpacity
              onPress={showImageActionSheet}
              style={[styles.imageContainer, { height: imageContainerHeight }]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>
                  {placeholder || "Select Image"}
                </Text>
              )}
            </TouchableOpacity>
          </>
        ) : datePicker ? (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{ flex: 1 }}
            >
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
                value={date ? date : ""}
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
          </>
        ) : (
          <>
            {title === "Phone" && (
              <TouchableOpacity
                style={styles.countryPickerContainer}
                onPress={() => setShow(true)}
              >
                <CountryPicker
                  lang="en"
                  initialState={countryCode}
                  show={show}
                  inputPlaceholder="Select your country"
                  pickerButtonOnPress={(item) => {
                    setCountryCode(item?.dial_code);
                    setShow(false);
                  }}
                  style={{
                    modal: { ...styles.countryPicker },
                    countryName: {
                      ...theme.FONTS.Mulish_400Regular,
                    },
                    dialCode: {
                      ...theme.FONTS.Mulish_400Regular,
                    },
                    searchMessageText: {
                      ...theme.FONTS.Mulish_400Regular,
                    },
                  }}
                />
                <Text style={styles.countryCode}>{countryCode}</Text>
              </TouchableOpacity>
            )}
            <TextInput
              style={[
                styles.textInput,
                {
                  height: multiline ? undefined : "100%",
                  textAlignVertical: multiline ? "top" : "center",
                  paddingVertical: multiline ? 10 : 0,
                },
              ]}
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
                style={styles.eyeIcon}
              >
                {isSecure ? <svg.EyeOffSvg /> : <svg.EyeSvg />}
              </TouchableOpacity>
            )}
          </>
        )}

        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
        {check && (
          <View style={styles.checkIcon}>
            <svg.CheckSvg />
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    width: "100%",
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 20,
  },
  titleContainer: {
    position: "absolute",
    top: -12,
    left: 20,
    paddingHorizontal: 10,
    backgroundColor: theme.COLORS.white,
  },
  titleText: {
    ...theme.FONTS.Mulish_600SemiBold,
    fontSize: 12,
    textTransform: "capitalize",
    color: theme.COLORS.gray1,
    lineHeight: 12 * 1.7,
  },
  checkIcon: {
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: theme.COLORS.lightGray,
    fontSize: 16,
    ...theme.FONTS.Mulish_400Regular,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.COLORS.lightGray,
    padding: 20,
    height: "40%",
    marginTop: "auto",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  cameraButton: {
    backgroundColor: theme.COLORS.black,
  },
  galleryButton: {
    backgroundColor: theme.COLORS.black,
  },
  cancelButton: {
    backgroundColor: theme.COLORS.black,
  },
  modalButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    ...theme.FONTS.Mulish_400Regular,
    marginLeft: 10,
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: 2,
    height: 50,
    borderRightWidth: 1,
    borderRightColor: theme.COLORS.lightGray,
  },
  countryPicker: {
    flex: 1,
  },
  countryCode: {
    fontSize: 16,
    ...theme.FONTS.Mulish_400Regular,
    color: theme.COLORS.gray1,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    flex: 1,
    height: 50,
    width: "100%",
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  inputAndroid: {
    flex: 1,
    height: 50,
    width: "100%",
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
    color: theme.COLORS.black,
  },
  placeholder: {
    color: theme.COLORS.lightGray,
    fontSize: 16,
  },
});

export default InputField;
