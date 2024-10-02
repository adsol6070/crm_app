import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../../constants/theme";
import { leadService } from "../../../api/lead";
import { useAuth } from "../../../common/context/AuthContext";
import { userService } from "../../../api/user";
import { skeletonLoader } from "../../../components/skeletonLoaders";
import { usePermissions } from "../../../common/context/PermissionContext";
import { hasPermission } from "../../../utils/HasPermission";
import Header1 from "../../../components/Header1";

type RootStackParamList = {
  LeadDetail: { leadId: string };
  LeadHistory: { leadId: string };
  DocumentChecklist: { leadId: string; visaType: string };
  EditLead: { leadId: string };
};

const LeadActions = () => {
  const route = useRoute();
  const { user } = useAuth();
  const { permissions, refreshPermissions } = usePermissions();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { leadId, visaType }: any = route.params;
  const [leadDetail, setLeadDetail] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [assignees, setAssignees] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<any[]>([]);

  const getLeadDetail = async () => {
    try {
      const response: any = await leadService.getLeadById(leadId);
      setLeadDetail(response);
      setStatus(response.leadStatus);
    } catch (error) {
      console.log("Error fetching details", error);
    } finally {
      setLoading(false);
    }
  };

  const getLeadAssignee = async () => {
    try {
      const response: any = await leadService.getAssigneeById(leadId);
      if (response.length !== 0) {
        setSelectedAssignees(response.user_id);
      }
    } catch (error) {
      console.log("Error fetching assignees", error);
    }
  };

  const getUsers = async () => {
    try {
      const response: any = await userService.getAllUsers();
      const filteredUsers = response.users.filter(
        (user: any) => user.role !== "superAdmin"
      );
      setAssignees(filteredUsers);
    } catch (error) {
      console.log("Error fetching users", error);
    }
  };

  useEffect(() => {
    getLeadDetail();
    getUsers();
    getLeadAssignee();
    refreshPermissions();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getLeadDetail();
    getUsers();
    getLeadAssignee();
    refreshPermissions();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const statusOptions = [
    { label: "New", value: "new" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "inprogress" },
    { label: "Completed", value: "completed" },
  ];

  const handleStatusChange = async (value: string) => {
    setStatus(value);
    try {
      const data = {
        userID: user?.sub,
        leadStatus: value,
      };
      await leadService.updateLeadStatusById(leadId, data);
      getLeadDetail();
      Alert.alert("Status Updated Successfully");
    } catch (error) {
      console.log("Error updating Status ", error);
    }
  };

  const handleAssignLead = async () => {
    setIsAssigning(false);
    try {
      const data = {
        lead_id: leadId,
        user_id: selectedAssignees,
      };
      console.log(data);
      const response: any = await leadService.assignLead(data);
      getLeadDetail();
      Alert.alert(response.message);
    } catch (error) {
      console.log("Error assigning lead", error);
    }
  };

  const toggleAssignee = (userId: string) => {
    setSelectedAssignees((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const renderHeader = () => (
    <components.Header title="Lead Actions" goBack={true} />
  );

  const renderStatusPicker = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => handleStatusChange(itemValue)}
        style={[
          styles.picker,
          { backgroundColor: getPickerBackgroundColor(status) },
        ]}
        itemStyle={{}}
      >
        {statusOptions.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );

  const getPickerBackgroundColor = (status: string) => {
    switch (status) {
      case "new":
        return "#757373";
      case "pending":
        return "#E2B263";
      case "inprogress":
        return "#007BFF";
      case "completed":
        return "#28A745";
      default:
        return "#757373";
    }
  };

  const renderContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.leadDetailArea}>
        <Text style={styles.leadIdText}>Lead ID: {leadId}</Text>
        <Text style={styles.leadNameText}>
          {leadDetail.firstname} {leadDetail.lastname}
        </Text>
      </View>
      {hasPermission(permissions, "Leads", "Status") && (
        <View style={styles.statusUpdateContainer}>
          <Text style={styles.statusLabel}>Update Status:</Text>
          {renderStatusPicker()}
        </View>
      )}
      <View style={styles.actionContainer}>
        {hasPermission(permissions, "Leads", "View") && (
          <ActionButton
            title="Lead Details"
            iconName="visibility"
            iconColor={theme.COLORS.black}
            onPress={() => navigation.navigate("LeadDetail", { leadId })}
          />
        )}
        {hasPermission(permissions, "Leads", "History") && (
          <ActionButton
            title="Lead History"
            iconName="history"
            iconColor={theme.COLORS.primary}
            onPress={() => navigation.navigate("LeadHistory", { leadId })}
          />
        )}
        {hasPermission(permissions, "Leads", "Checklist") && (
          <ActionButton
            title="Document Checklist"
            iconName="description"
            iconColor="black"
            onPress={() =>
              navigation.navigate("DocumentChecklist", { leadId, visaType })
            }
          />
        )}
        {hasPermission(permissions, "Leads", "Edit") && (
          <ActionButton
            title="Edit Lead"
            iconName="edit"
            iconColor="blue"
            onPress={() => navigation.navigate("EditLead", { leadId })}
          />
        )}
        {hasPermission(permissions, "Leads", "Assign") && (
          <ActionButton
            title="Assign Lead"
            iconName="assignment"
            iconColor="green"
            onPress={() => setIsAssigning(true)}
          />
        )}
      </View>
      <AssignModal
        visible={isAssigning}
        onClose={() => setIsAssigning(false)}
        onAssign={handleAssignLead}
        assignees={assignees}
        selectedAssignees={selectedAssignees}
        toggleAssignee={toggleAssignee}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title="Lead Actions"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollView}
      >
        {loading ? (
          <skeletonLoader.ListSkeletonLoader itemCount={7} itemHeight={75} />
        ) : (
          renderContent()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const AssignModal = ({
  visible,
  onClose,
  onAssign,
  assignees,
  selectedAssignees,
  toggleAssignee,
}: any) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Assign Lead</Text>
        <FlatList
          data={assignees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => toggleAssignee(item.id)}
            >
              <Text style={styles.checkboxLabel}>
                {item.firstname} {item.lastname}
              </Text>
              <MaterialIcons
                name={
                  selectedAssignees.includes(item.id)
                    ? "check-box"
                    : "check-box-outline-blank"
                }
                size={24}
                color={theme.COLORS.primary}
              />
            </TouchableOpacity>
          )}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onAssign}>
            <Text style={styles.modalButtonText}>Assign</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ActionButton = ({ title, iconName, iconColor, onPress }: any) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <View style={styles.iconWrapper}>
      <MaterialIcons name={iconName} size={24} color={iconColor} />
    </View>
    <Text style={styles.actionButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.tertiaryWhite,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  leadDetailArea: {
    marginBottom: 20,
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  leadIdText: {
    fontSize: 16,
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_700Bold,
  },
  leadNameText: {
    fontSize: 18,
    color: theme.COLORS.primary,
    ...theme.FONTS.Mulish_600SemiBold,
  },
  statusUpdateContainer: {
    margin: 10,
  },
  statusLabel: {
    fontSize: 16,
    color: theme.COLORS.black,
    marginBottom: 5,
    ...theme.FONTS.Mulish_700Bold,
  },
  pickerContainer: {
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: theme.COLORS.white,
  },
  actionContainer: {
    justifyContent: "space-around",
    marginBottom: 5,
  },
  actionButton: {
    alignItems: "center",
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.white,
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    marginBottom: 5,
  },
  actionButtonText: {
    fontSize: 14,
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_600SemiBold,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.COLORS.white,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_700Bold,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: theme.COLORS.lightGray,
  },
  checkboxLabel: {
    fontSize: 16,
    color: theme.COLORS.black,
    ...theme.FONTS.Mulish_400Regular,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LeadActions;
