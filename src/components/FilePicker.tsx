import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

interface FilePickerProps {
  file: any | null;
  setFile: (file: any | null) => void;
  allowFilePick?: boolean;
  allowImagePick?: boolean;
  allowCamera?: boolean;
}

const FilePicker: React.FC<FilePickerProps> = ({
  file,
  setFile,
  allowFilePick = false,
  allowImagePick = false,
  allowCamera = false,
}) => {
  const pickFile = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.type === "cancel") {
        Alert.alert("File selection cancelled.");
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        const fileData = {
          uri: selectedFile.uri,
          name: selectedFile.name || "unknown",
          type: selectedFile.mimeType || "application/octet-stream",
          size: selectedFile.size || 0,
        };
        setFile(fileData);
      } else {
        Alert.alert("Failed to pick file.");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Failed to pick file.");
    }
  };

  const pickImage = async () => {
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (libraryStatus !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need media library permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const imageData = {
        uri: image.uri,
        name: image.fileName || "unknown",
        type: image.mimeType || "image/jpeg",
        size: image.fileSize || 0,
      };
      setFile(imageData);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const imageData = {
        uri: image.uri,
        name: image.fileName || "unknown",
        type: image.mimeType || "image/jpeg",
        size: image.fileSize || 0,
      };
      setFile(imageData);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {allowFilePick && (
          <TouchableOpacity style={styles.button} onPress={pickFile}>
            <Text style={styles.buttonText}>Pick a File</Text>
          </TouchableOpacity>
        )}
        {allowImagePick && (
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an Image from Gallery</Text>
          </TouchableOpacity>
        )}
        {allowCamera && (
          <TouchableOpacity style={styles.buttonCamera} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      {file ? (
        <View style={styles.fileInfo}>
          <Text style={styles.fileName}>File Name: {file.name}</Text>
          {file.type.startsWith("image/") ? (
            <Image source={{ uri: file.uri }} style={styles.image} />
          ) : (
            <Text style={styles.fileType}>
              File Type: {file.type.split("/").pop()}
            </Text>
          )}
          <TouchableOpacity style={styles.removeButton} onPress={removeFile}>
            <MaterialIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>No file selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 240,
    alignItems: "center",
  },
  buttonCamera: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: theme.COLORS.white,
    ...theme.FONTS.Mulish_400Regular,
  },
  fileInfo: {
    marginTop: 20,
    position: "relative",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007bff",
  },
  fileType: {
    fontSize: 14,
    color: "#6c757d",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 50,
    padding: 5,
  },
  text: {
    color: "#666",
    ...theme.FONTS.Mulish_400Regular,
  },
});

export default FilePicker;
