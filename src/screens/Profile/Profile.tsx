import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { components } from "../../components";
import { constants } from "../../constants";
import { svg } from "../../svg";
import { useAuth } from "../../common/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { userService } from "../../api/user";
import DetailSkeletonLoader from "../Users/Detail/SkeletonLoader";
import * as ImagePicker from "expo-image-picker";
import Header1 from "../../components/Header1";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { formatRoleDisplayName } from "../../utils/FormatRoleDisplayName";

const Profile = () => {
  const { logout, user } = useAuth();
  const { theme } = constants;
  const { showActionSheetWithOptions } = useActionSheet();
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<undefined | any>(undefined);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const userId = user?.sub;
      const response = await userService.getProfile({ userId });
      setCurrentUser(response);
    } catch (error) {
      console.log("Profile Fetching error ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [user])
  );

  const uploadProfileImage = async (image: any) => {
    try {
      await userService.updateProfileImage(user?.sub, image);
      Alert.alert("Success", "Profile image updated successfully");
      await fetchProfile();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile image");
      console.error("Error updating profile image:", error);
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

  const renderContent = () => {
    if (!currentUser) {
      return <ActivityIndicator size="large" color={theme.COLORS.lightGray} />;
    }

    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 80,
          marginTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={{ width: 126, height: 126, marginBottom: 20 }}
          onPress={handleEditProfileImage}
        >
          {avatarLoading && (
            <ActivityIndicator
              size="small"
              color={theme.COLORS.lightGray}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 0,
                opacity: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#EBF2FC",
                borderRadius: 126 / 2,
              }}
            />
          )}
          <Image
            source={{
              uri: `${
                currentUser.profileImageUrl === ""
                  ? "https://avatar.iran.liara.run/public/boy"
                  : currentUser.profileImageUrl
              }`,
            }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 63,
              borderWidth: 6,
              borderColor: theme.COLORS.lightBlue1,
            }}
            onLoadStart={() => setAvatarLoading(true)}
            onLoadEnd={() => setAvatarLoading(false)}
          />
          <View style={{ position: "absolute", right: 6, bottom: 6 }}>
            <svg.ProfileEditSvg />
          </View>
        </TouchableOpacity>

        <Text style={{ ...theme.FONTS.H3, color: theme.COLORS.black }}>
          {currentUser.firstname}
        </Text>
        <Text
          style={{
            ...theme.FONTS.Mulish_400Regular,
            fontSize: 14,
            color: theme.COLORS.gray1,
            lineHeight: 14 * 1.7,
            marginBottom: 22,
          }}
        >
          {currentUser.email}
        </Text>
        <View style={{ width: "100%" }}>
          <components.ProfileCategory
            title={currentUser.id ?? "N/A"}
            icon={<svg.UserIdSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={formatRoleDisplayName(currentUser.role) ?? "N/A"}
            icon={<svg.RoleSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.phone ?? "N/A"}
            icon={<svg.PhoneSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.city ?? "N/A"}
            icon={<svg.CitySvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.address ?? "N/A"}
            icon={<svg.MapPinSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title="Sign out"
            icon={<svg.LogOutSvg />}
            categoryNavigation={false}
            onPress={() => setShowModal(true)}
          />
        </View>
      </ScrollView>
    );
  };

  const renderModal = () => {
    const hanldeLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout Error:", error);
      }
    };
    return (
      <View style={{ alignSelf: "center" }}>
        <Modal
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
          hideModalContentWhileAnimating={true}
          backdropTransitionOutTiming={0}
          style={{ margin: 0 }}
          animationIn="zoomIn"
          animationOut="zoomOut"
        >
          <View
            style={{
              width: 335,
              height: 335,
              backgroundColor: theme.COLORS.transparent,
              borderRadius: 200,
              borderWidth: 4,
              borderColor: theme.COLORS.white,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                width: 292,
                height: 292,
                backgroundColor: theme.COLORS.white,
                borderRadius: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Line /> */}
              <Text
                style={{
                  textAlign: "center",
                  ...theme.FONTS.H3,
                  paddingHorizontal: 30,
                  marginVertical: 20,
                }}
              >
                Are you sure you want to sign out ?
              </Text>
              <TouchableOpacity
                style={{
                  height: 50,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: theme.COLORS.black,
                  marginBottom: 20,
                }}
                onPress={() => {
                  setShowModal(false);
                  hanldeLogout();
                }}
              >
                <Text
                  style={{
                    color: theme.COLORS.white,
                    textTransform: "uppercase",
                    ...theme.FONTS.Mulish_600SemiBold,
                    fontSize: 14,
                    paddingHorizontal: 51,
                    textAlign: "center",
                  }}
                >
                  sure
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text
                  style={{
                    color: theme.COLORS.black,
                    textTransform: "uppercase",
                    ...theme.FONTS.Mulish_600SemiBold,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  if (loading) {
    return <DetailSkeletonLoader />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.white }}>
      <Header1 title="Profile" />
      <ScrollView>
        {renderContent()}
        {renderModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
