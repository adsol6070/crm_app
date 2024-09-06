import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  Clipboard,
  Linking,
  Share,
  RefreshControl,
  ActionSheetIOS,
  Platform,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { userService } from "../../api/user";
import { theme } from "../../constants/theme";
import MapView, { Marker } from "react-native-maps";
import DetailSkeletonLoader from "./DetailSkeletonLoader";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Header1 from "../../components/Header1";

const { width } = Dimensions.get("window");

const UserDetail = () => {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const route = useRoute();
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await userService.getUser(userId);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser();
    setRefreshing(false);
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    navigation.navigate("EditUser", { userId: user?.id });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await userService.deleteUser(user?.id);
              navigation.goBack();
              Alert.alert("Success", "User deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Failed to delete user");
              console.error("Error deleting user:", error);
            }
          },
        },
      ]
    );
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert("Copied", "Text copied to clipboard!");
  };

  const initiateCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleShare = async () => {
    try {
      const message = `
        User Details:
        Name: ${user?.firstname || "John"} ${user?.lastname || "Doe"}
        Email: ${user?.email || "example@example.com"}
        Phone: ${user?.phone || "+00 0000000000"}
        City: ${user?.city || "City"}
        Address: ${user?.address || "Address"}
        Created At: ${
          user?.created_at ? new Date(user.created_at).toLocaleString() : "N/A"
        }
      `;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing user details:", error);
    }
  };

  const handleEditProfileImage = async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (mediaStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera and photo library permissions are required to change profile picture."
        );
        return;
      }

      const options = ["Cancel", "Take Photo", "Choose from Library"];
      const destructiveIndex = 1;

      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
          destructiveButtonIndex: destructiveIndex,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {  
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });

            if (!result.canceled) {
              const image = result.assets[0];
              const profileImage = {
                uri: image.uri,
                name: image.fileName || "unknown",
                type: image.mimeType || "image/jpeg",
                size: image.fileSize || 0,
              };
              await uploadProfileImage(profileImage);
            }
          } else if (buttonIndex === 2) {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
            });

            if (!result.canceled) {
              const image = result.assets[0];
              const profileImage = {
                uri: image.uri,
                name: image.fileName || "unknown",
                type: image.mimeType || "image/jpeg",
                size: image.fileSize || 0,
              };
              await uploadProfileImage(profileImage);
            }
          }
        }
      );
    } else {
      Alert.alert(
        "Feature Not Available",
        "This feature is not available on this platform."
      );
    }
  };

  const uploadProfileImage = async (image: any) => {
    try {
      await userService.updateProfileImage(userId, image);
      Alert.alert("Success", "Profile image updated successfully");
      await fetchUser();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile image");
      console.error("Error updating profile image:", error);
    }
  };

  if (loading) {
    return <DetailSkeletonLoader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title="User Details"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            {user?.profileImageUrl ? (
              <Image
                source={{ uri: user.profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {user?.firstname
                    ? user.firstname.charAt(0).toUpperCase()
                    : "N/A"}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editIconContainer}
              onPress={handleEditProfileImage}
            >
              <MaterialIcons name="edit" size={24} color={theme.COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {user?.firstname || "John"} {user?.lastname || "Doe"}
          </Text>
          <Text style={styles.userRole}>{user?.role || "User"}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Tenant ID</Text>
            <Text style={styles.detailText}>{user?.tenantID || "N/A"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>User ID</Text>
            <Text style={styles.detailText}>{user?.id || "N/A"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Email</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailText}>
                {user?.email || "example@example.com"}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(user?.email || "example@example.com")
                }
                style={styles.iconContainer}
              >
                <MaterialIcons
                  name="content-copy"
                  size={20}
                  color={theme.COLORS.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleEmail(user?.email || "example@example.com")
                }
                style={styles.iconContainer}
              >
                <Ionicons name="mail" size={20} color={theme.COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Phone Number</Text>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailText}>
                {user?.phone || "+00 0000000000"}
              </Text>
              <TouchableOpacity
                onPress={() => initiateCall(user?.phone || "+00 0000000000")}
                style={styles.iconContainer}
              >
                <Ionicons name="call" size={20} color={theme.COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>City</Text>
            <Text style={styles.detailText}>{user?.city || "City"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Address</Text>
            <Text style={styles.detailText}>{user?.address || "Address"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Created At</Text>
            <Text style={styles.detailText}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleString()
                : "N/A"}
            </Text>
          </View>

          {/* {user?.latitude && user?.longitude && ( */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 37.7749, // Dummy latitude
                longitude: -122.4194, // Dummy longitude
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 37.7749, // Dummy latitude
                  longitude: -122.4194, // Dummy longitude
                }}
                title="San Francisco"
                description="A popular city in California."
              />
            </MapView>
          </View>
          {/* )} */}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleEdit}>
            <AntDesign name="edit" size={24} color={theme.COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={24} color={theme.COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Ionicons
              name="share-social"
              size={24}
              color={theme.COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 22,
    backgroundColor: theme.COLORS.white,
    paddingBottom: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: theme.COLORS.black,
    ...theme.FONTS.H4,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  profileImageText: {
    fontSize: 40,
    color: "#757575",
    ...theme.FONTS.Mulish_600SemiBold,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 4,
    right: 0,
    backgroundColor: theme.COLORS.primary,
    padding: 5,
    borderRadius: 20,
  },
  userName: {
    fontSize: 24,
    marginVertical: 10,
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_600SemiBold,
  },
  userRole: {
    fontSize: 16,
    color: "#757575",
    ...theme.FONTS.Mulish_400Regular,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 14,
    color: "#757575",
    ...theme.FONTS.Mulish_400Regular,
  },
  detailTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  detailText: {
    fontSize: 16,
    color: theme.COLORS.black,
    marginTop: 4,
    ...theme.FONTS.Mulish_400Regular,
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  mapContainer: {
    height: 200,
    marginTop: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  deleteButton: {
    backgroundColor: "#B00020",
  },
  shareButton: {
    backgroundColor: "#1e90ff",
  },
});

export default UserDetail;
