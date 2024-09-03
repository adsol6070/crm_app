import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 

interface ImagePickerProps {
  image: any | null;
  setImage: (image: any | null) => void;
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({ image, setImage }) => {
  
  const pickImage = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (libraryStatus !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0]
      const imgData = {
        uri: image.uri,
        name: image.fileName || "unknown",
        type: image.mimeType || "image/jpeg",
        size: image.fileSize || 0,
      }
      setImage(imgData);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0]
      const imgData = {
        uri: image.uri,
        name: image.fileName || "unknown",
        type: image.mimeType || "image/jpeg",
        size: image.fileSize || 0,
      }
      setImage(imgData);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCamera} onPress={takePhoto}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.uri }} style={styles.image} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <MaterialIcons name="cancel" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>No image selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  buttonContainer: {
    marginBottom: 20,
    flex: 1,
    flexDirection: 'row'
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: 240,
    alignItems: 'center',
  },
  buttonCamera: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    position: 'relative',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 50,
    padding: 5,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

export default ImagePickerComponent;
