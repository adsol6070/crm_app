import { useRef, useState } from "react";
import * as yup from "yup";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { RouteProp, useRoute } from "@react-navigation/native";
import { components } from "../../../components";
import { theme } from "../../../constants/theme";
import ListScreen from "../../Users/components/ListScreen";
import { checklistService } from "../../../api/checklist";
import { RootStackParamList } from "../../../navigation/AppNavigator";

type ChecklistDetailRouteProp = RouteProp<
  RootStackParamList,
  "ChecklistDetail"
>;

const ChecklistDetail = () => {
  const refreshRef = useRef<() => void>(() => {});
  const route = useRoute<ChecklistDetailRouteProp>();
  const { visaType, checklistId }: any = route?.params;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const validationSchema = yup.object({
    document: yup
      .string()
      .required("Document name is required")
      .min(2, "Category must be at least 2 characters")
      .max(30, "Category must be less than 30 characters"),
  });

  const fetchDocuments = async () => {
    try {
      const documents = await checklistService.getChecklistByVisaType(visaType);
      const checklists = documents?.checklists;
      setAllDocuments(checklists.checklist);
      return checklists;
    } catch (error) {
      console.error("Error while fetching documents:", error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const newDocument = { name: data.document, required: true };
      const updatedDocuments = [...allDocuments, newDocument];
      const formattedDocument = {
        checklist: JSON.stringify(updatedDocuments),
      };
      await checklistService.updateChecklistById(
        checklistId,
        formattedDocument
      );
      Alert.alert("Document added successfully");
      refreshRef.current?.();
    } catch (error) {
      console.log("Error creating categories", error);
    }
  };

  const handleEdit = async (data: any) => {
    try {
      const updatedDocuments = allDocuments.map((doc) =>
        doc.name === selectedDocument.name
          ? { ...doc, name: data.document }
          : doc
      );
      const formattedDocument = {
        checklist: JSON.stringify(updatedDocuments),
      };
      await checklistService.updateChecklistById(
        checklistId,
        formattedDocument
      );
      refreshRef.current?.();
      Alert.alert("Document updated successfully");
      closeEditModal();
    } catch (error) {
      console.log("Error creating categories", error);
    }
  };

  const onEditModal = (document: any) => {
    setSelectedDocument(document);
    setValue("document", document.name);
    setIsEditModalVisible(true);
  };

  const handleDelete = (name: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this document?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const updatedDocuments = allDocuments.filter(
                (doc) => doc.name !== name
              );
              const formattedDocument = {
                checklist: JSON.stringify(updatedDocuments),
              };
              await checklistService.updateChecklistById(
                checklistId,
                formattedDocument
              );
              refreshRef.current?.();
              Alert.alert("Document deleted successfully");
            } catch (error) {
              console.error("Error deleting document:", error);
            }
          },
        },
      ]
    );
  };

  const closeEditModal = () => {
    setSelectedDocument(null);
    setIsEditModalVisible(false);
    reset();
  };

  return (
    <>
      <ListScreen
        title="Checklist Documents"
        fetchData={fetchDocuments}
        placeholder="Search Document..."
        skeletonWithImage={false}
        centerComponent={(item) => {
          return <Text style={theme.FONTS.H4}>{item.name}</Text>;
        }}
        actionConfigs={[
          {
            iconName: "edit",
            iconType: "MaterialIcons",
            onPress: (item) => onEditModal(item),
            size: 20,
          },
          {
            iconName: "delete",
            iconType: "MaterialIcons",
            onPress: (item) => handleDelete(item.name),
            size: 20,
          },
        ]}
        searchKey="name"
        refreshRef={refreshRef}
        singleInputConfig={{
          name: "document",
          title: "Document",
          inputPlaceholder: "Enter document name",
          buttonText: "Add Document",
          onSubmit: (data) => onSubmit(data),
          validationSchema: validationSchema,
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Document</Text>
            <Controller
              name="document"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Document"
                  placeholder="Enter document name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.document?.message}
                />
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSubmit(handleEdit)}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={closeEditModal}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ChecklistDetail;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    ...theme.FONTS.H3,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "white",
    ...theme.FONTS.H4,
  },
  modalButtonCancel: {
    backgroundColor: "grey",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalButtonTextCancel: {
    color: "white",
    ...theme.FONTS.H4,
  },
});
