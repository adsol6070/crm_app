import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header1 from "../../components/Header1";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { useAuth } from "../../common/context/AuthContext";
import QRCode from "react-native-qrcode-svg";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type FormqrNavigationProp = StackNavigationProp<RootStackParamList, "Formqr">;

const Formqr = () => {
  const navigation = useNavigation<FormqrNavigationProp>();
  const { user } = useAuth();
  const qrValue = `http://localhost:5173/pages/createLead?tenantID=${user?.tenantID}`;

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title="Form QR"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={200}
          color="black"
          backgroundColor="white"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  qrContainer: {
    height: "78%",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Formqr;
