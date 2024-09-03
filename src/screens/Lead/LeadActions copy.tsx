import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { components } from '../../components';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { theme } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { leadService } from '../../api/lead';
import { useAuth } from '../../common/context/AuthContext';
import { userService } from '../../api/user1';

type RootStackParamList = {
    LeadHistory: { leadId: string };
    DocumentChecklist: { leadId: string };
    EditLead: { leadId: string };
};

const LeadActions = () => {
    const route = useRoute();
    const { user } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { leadId }: any = route.params;
    const [leadDetail, setLeadDetail] = useState<any>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState<boolean>(false);
    const [assignee, setAssignee] = useState<any[]>([]);

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

    const getUser = async ()=>{
        try {
            const response: any = await userService.getAllUsers();
            console.log(response)
            setAssignee(response.users)
        } catch (error) {
            console.log("Error fetching details", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLeadDetail();
        getUser();
    }, []);

    const statusOptions = [
        { label: 'New', value: 'new' },
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'inprogress' },
        { label: 'Completed', value: 'completed' },
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
                userID: user?.sub,
                assignee: assignee,
            };
            // await leadService.assignLeadById(leadId, data);
            getLeadDetail();
            Alert.alert("Lead Assigned Successfully");
        } catch (error) {
            console.log("Error assigning lead", error);
        }
    };

    const renderHeader = () => (
        <components.Header title="Lead Actions" goBack={true} />
    );

    const renderStatusPicker = () => (
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={status}
                onValueChange={(itemValue) => handleStatusChange(itemValue)}
                style={[styles.picker, { backgroundColor: getPickerBackgroundColor(status) }]}
            >
                {statusOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
            </Picker>
        </View>
    );

    const getPickerBackgroundColor = (status: string) => {
        switch (status) {
            case 'new':
                return '#757373';
            case 'pending':
                return '#E2B263';
            case 'inprogress':
                return '#007BFF';
            case 'completed':
                return '#28A745';
            default:
                return '#757373';
        }
    };

    const renderContent = () => (
        <View style={styles.contentContainer}>
            <View style={styles.leadDetailArea}>
                <Text style={styles.leadIdText}>Lead ID: {leadId}</Text>
                <Text style={styles.leadNameText}>{leadDetail.firstname} {leadDetail.lastname}</Text>
            </View>
            <View style={styles.statusUpdateContainer}>
                <Text style={styles.statusLabel}>Update Status:</Text>
                {renderStatusPicker()}
            </View>
            <View style={styles.actionContainer}>
                <ActionButton
                    title="Lead History"
                    iconName="history"
                    iconColor={theme.COLORS.primary}
                    onPress={() => navigation.navigate("LeadHistory", { leadId })}
                />
                <ActionButton
                    title="Document Checklist"
                    iconName="description"
                    iconColor="black"
                    onPress={() => navigation.navigate("DocumentChecklist", { leadId })}
                />
                <ActionButton
                    title="Edit Lead"
                    iconName="edit"
                    iconColor="blue"
                    onPress={() => navigation.navigate("EditLead", { leadId })}
                /> 
                <ActionButton
                    title="Assign Lead"
                    iconName="assignment"
                    iconColor="green"
                    onPress={() => setIsAssigning(true)}
                />
            </View>
            <AssignModal
                visible={isAssigning}
                onClose={() => setIsAssigning(false)}
                onAssign={handleAssignLead}
                assignee={assignee}
                setAssignee={setAssignee}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {renderHeader()}
                {loading ? <components.Spinner /> : renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};

const AssignModal = ({ visible, onClose, onAssign, assignee, setAssignee }: any) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Assign Lead</Text>
                <TextInput
                    style={styles.modalInput}
                    placeholder="Enter assignee name"
                    value={assignee}
                    onChangeText={setAssignee}
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
        padding: 20,
    },
    leadDetailArea: {
        marginBottom: 30,
        backgroundColor: theme.COLORS.white,
        borderRadius: 10,
        padding: 15,
        shadowColor: theme.COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    leadIdText: {
        fontSize: 16,
        color: theme.COLORS.gray1,
        marginBottom: 5,
    },
    leadNameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.COLORS.black,
    },
    statusUpdateContainer: {
        marginBottom: 30,
    },
    statusLabel: {
        fontSize: 18,
        marginBottom: 10,
        color: theme.COLORS.black,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: theme.COLORS.white,
        borderRadius: 10,
        width: '55%',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: 'white',
    },
    actionContainer: {
        flex: 1,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.COLORS.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        shadowColor: theme.COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.COLORS.lightBlue1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionButtonText: {
        fontSize: 18,
        color: theme.COLORS.black,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: theme.COLORS.gray1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: theme.COLORS.primary,
        borderRadius: 5,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        width: '45%',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default LeadActions;
