import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { components } from "../components";
import { constants } from "../constants";
import { svg } from "../svg";
import { useAuth } from "../common/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { userService } from "../api/user";

const Profile = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const { theme } = constants;
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<ProfileResponse | undefined>(undefined);
  const [avatarLoading, setAvatarLoading] = useState(true);

  useEffect(()=>{
    const fetchProfile = async ()=>{
    try {
      const userId = user?.sub
      console.log("UserId:", userId);
      const response = await userService.getProfile({userId})
      console.log("Profile Response ", response)
      setCurrentUser(response)
    } catch (error) {
      console.log("Profile Fetching error ", error)
    }
  }
  fetchProfile();
  },[])

  const renderHeader = () => {
    return (
      <components.Header
        title="Profile"
      />
    );
  };

  const renderContent = () => {
    if (!currentUser) {
      return <ActivityIndicator size="large" color={theme.COLORS.lightGray} />;
    }
    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={{ width: 126, height: 126, marginBottom: 20 }}
        // onPress={() => navigation.navigate("EditProfile")}
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
              uri: "https://avatar.iran.liara.run/public/boy",
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
            title={currentUser.id === "null" ? "N/A": currentUser.id}
            icon={<svg.UserIdSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.role === "null" ? "N/A": currentUser.role}
            icon={<svg.RoleSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.phone === "null" ? "N/A": currentUser.phone}
            icon={<svg.PhoneSvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.city === "null" ? "N/A": currentUser.city}
            icon={<svg.CitySvg />}
            categoryNavigation={false}
          />
          <components.ProfileCategory
            title={currentUser.address === "null" ? "N/A": currentUser.address}
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
        console.error('Logout Error:', error);
      }
    }
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ flex: 1, marginBottom: 50 }}>
          {renderHeader()}
          {renderContent()}
          {renderModal()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
