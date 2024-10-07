import * as yup from "yup";
import { useRef, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { components } from "../../components";
import { leadService } from "../../api/lead";
import { theme } from "../../constants/theme";
import ListScreen from "../Users/components/ListScreen";
import { formatRoleDisplayName } from "../../utils/FormatRoleDisplayName";

const VisaCategory = () => {
  const refreshRef = useRef<() => void>(() => {});
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const validationSchema = yup.object({
    category: yup
      .string()
      .required("Category is required")
      .min(2, "Category must be at least 2 characters")
      .max(30, "Category must be less than 30 characters")
      .matches(
        /^[a-z_]+$/,
        "Category name must be lowercase with underscores only."
      ),
  });

  const onSubmit = async (data: any) => {
    try {
      await leadService.createVisaCategory(data);
      refreshRef.current?.();
      Alert.alert("Category added successfully");
    } catch (error) {
      console.log("Error creating categories", error);
    }
  };

  const handleEdit = async (data: any) => {
    try {
      await leadService.updateVisaCategory(selectedCategory.id, data);
      refreshRef.current?.();
      closeEditModal();
      Alert.alert("Category updated successfully");
    } catch (error) {
      console.log("Error creating categories", error);
    }
  };

  const onEditModal = (category: any) => {
    setSelectedCategory(category);
    setValue("category", category.category);
    setIsEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this category?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await leadService.deleteVisaCategory(id);
              refreshRef.current?.();
            } catch (error) {
              console.error("Error deleting category:", error);
            }
          },
        },
      ]
    );
  };

  const closeEditModal = () => {
    setSelectedCategory(null);
    setIsEditModalVisible(false);
    reset();
  };

  return (
    <>
      <ListScreen
        title="Visa Category"
        fetchData={leadService.getVisaCategory}
        placeholder="Search Category..."
        skeletonWithImage={false}
        centerComponent={(item) => {
          return (
            <Text style={theme.FONTS.H4}>
              {formatRoleDisplayName(item.category)}
            </Text>
          );
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
            onPress: (item) => handleDelete(item.id),
            size: 20,
          },
        ]}
        searchKey="category"
        refreshRef={refreshRef}
        singleInputConfig={{
          name: "category",
          title: "Category",
          inputPlaceholder: "e.g. student_visa, visitor_visa",
          buttonText: "Add Category",
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
            <Text style={styles.modalTitle}>Edit Category</Text>
            <Controller
              name="category"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <components.InputField
                  title="Category"
                  placeholder="Enter category name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.category?.message}
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

export default VisaCategory;

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
