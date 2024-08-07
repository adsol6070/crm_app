import React, { useState, FC } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Modal from "react-native-modal";

import { components } from "../../components";
import { constants } from "../../constants";
import { svg } from "../../svg";
import { RootStackParamList } from "../../types";
import { SafeAreaView } from "react-native-safe-area-context";

// Define your navigation prop type
const { theme } = constants;
type ProfileScreenNavigationProp = NavigationProp<RootStackParamList, 'Profile'>;

const Profile: FC = () => {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const [showModal, setShowModal] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(true);

    const renderHeader = () => {
        return (
            <components.Header
                title="Profile"
                goBack= {true}
            />
        );
    };

    const renderContent = () => {
        return (
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={() => navigation.navigate("EditProfile")}
                >
                    {avatarLoading && (
                        <ActivityIndicator
                            size="small"
                            color={theme.COLORS.lightGray}
                            style={styles.activityIndicator}
                        />
                    )}
                    <Image
                        source={{ uri: "https://dl.dropbox.com/s/tcc67qouu0bzuzc/user.png?dl=0" }}
                        style={styles.avatar}
                        onLoadStart={() => setAvatarLoading(true)}
                        onLoadEnd={() => setAvatarLoading(false)}
                    />
                    <View style={styles.editIconContainer}>
                        <svg.ProfileEditSvg />
                    </View>
                </TouchableOpacity>

                <Text style={styles.username}>Kristin Watson</Text>
                <Text style={styles.email}>kristinwatson@mail.com</Text>
                <View style={styles.profileCategories}>
                    <components.ProfileCategory
                        title="Order history"
                        icon={<svg.CalendarSvg />}
                        onPress={() => navigation.navigate("OrderHistory")}
                    />
                    <components.ProfileCategory
                        title="Payment method"
                        icon={<svg.CreditCardSvg />}
                        onPress={() => navigation.navigate("PaymentMethod")}
                    />
                    <components.ProfileCategory
                        title="My address"
                        icon={<svg.MapPinSvg />}
                        onPress={() => navigation.navigate("MyAddress")}
                    />
                    <components.ProfileCategory
                        title="My promocodes"
                        icon={<svg.GiftSvg />}
                        onPress={() => navigation.navigate("MyPromocodes")}
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
        return (
            <View style={styles.modalContainer}>
                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => setShowModal(false)}
                    hideModalContentWhileAnimating={true}
                    backdropTransitionOutTiming={0}
                    style={styles.modal}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Are you sure you want to sign out ?
                        </Text>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => {
                                setShowModal(false);
                                navigation.navigate("SignIn");
                            }}
                        >
                            <Text style={styles.confirmButtonText}>Sure</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {renderHeader()}
                {renderContent()}
                {renderModal()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    scrollContainer: {
        alignItems: "center",
        paddingBottom: 20,
    },
    line: {
        marginTop: 23,
        marginBottom: 20,
    },
    avatarContainer: {
        width: 126,
        height: 126,
        marginBottom: 20,
    },
    activityIndicator: {
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
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 63,
        borderWidth: 6,
        borderColor: theme.COLORS.lightBlue1,
    },
    editIconContainer: {
        position: "absolute",
        right: 6,
        bottom: 6,
    },
    username: {
        ...theme.FONTS.H3,
        color: theme.COLORS.black,
    },
    email: {
        ...theme.FONTS.Mulish_400Regular,
        fontSize: 14,
        color: theme.COLORS.gray1,
        lineHeight: 14 * 1.7,
        marginBottom: 22,
    },
    profileCategories: {
        width: "100%",
    },
    modalContainer: {
        alignSelf: "center",
    },
    modal: {
        margin: 0,
    },
    modalContent: {
        width: 335,
        height: 335,
        backgroundColor: theme.COLORS.transparent,
        borderRadius: 200,
        borderWidth: 4,
        borderColor: theme.COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    modalText: {
        textAlign: "center",
        ...theme.FONTS.H3,
        paddingHorizontal: 30,
        marginVertical: 20,
    },
    confirmButton: {
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.COLORS.black,
        marginBottom: 20,
    },
    confirmButtonText: {
        color: theme.COLORS.white,
        textTransform: "uppercase",
        ...theme.FONTS.Mulish_600SemiBold,
        fontSize: 14,
        paddingHorizontal: 51,
        textAlign: "center",
    },
    cancelButtonText: {
        color: theme.COLORS.black,
        textTransform: "uppercase",
        ...theme.FONTS.Mulish_600SemiBold,
        fontSize: 14,
        textAlign: "center",
    },
    container: {
        flex: 1,
    },
});

export default Profile;
