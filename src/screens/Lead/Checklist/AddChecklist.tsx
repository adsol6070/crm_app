import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { theme } from "../../../constants/theme";
import { leadService } from "../../../api/lead";
import { components } from "../../../components";
import { capitalizeFirstLetter } from "../../../utils/CapitalizeFirstLetter";
import { checklistService } from "../../../api/checklist";
import Header1 from "../../../components/Header1";
import { formatRoleDisplayName } from "../../../utils/FormatRoleDisplayName";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

const schema = yup.object().shape({
  visaType: yup.string().required("Visa Type is required"),
});

type AddChecklistNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddChecklist"
>;

const AddChecklist = () => {
  const navigation = useNavigation<AddChecklistNavigationProp>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [visaCategories, setVisaCategories] = useState<any[]>([]);
  const [documents, setDocuments] = useState([{ name: "" }]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchCategories = async () => {
    try {
      const response: any = await leadService.getVisaCategory();
      const newCategories = response.map((category: any) => ({
        label: formatRoleDisplayName(category.category),
        value: category.category,
      }));
      setVisaCategories(newCategories);
    } catch (error) {
      console.error("Error fetching visa categories", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategories();
    reset();
    setDocuments([{ name: "" }]);
    fetchCategories().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );
  const addDocument = () => {
    setDocuments([...documents, { name: "" }]);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleDocumentChange = (text: string, index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].name = text;
    setDocuments(updatedDocuments);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = {
        ...data,
        checklist: documents.map((doc: any) => ({
          ...doc,
          required: true,
        })),
      };
      const visaChecklists: any = await checklistService.getAllChecklist();
      const exists = visaChecklists.checklists.some(
        (checklist: any) => checklist.visaType === formData.visaType
      );
      if (exists) {
        Alert.alert("Checklist already exists");
      } else {
        const formattedData = {
          ...data,
          checklist: JSON.stringify(formData.checklist),
        };
        await checklistService.createChecklist(formattedData);
        reset();
        setDocuments([{ name: "" }]);
        Alert.alert("Checklist created successfully");
      }
    } catch (error) {
      console.log("Error creating checklist", error);
    }
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1 }}>
          <Header1
            title="Add Checklists"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
          />
          <ScrollView style={styles.addContainer}>
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.submitButtonText}>Add Checklist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={addDocument}>
                <Text style={styles.addButtonText}>+ Add More Document</Text>
              </TouchableOpacity>
            </View>
            <Controller
              control={control}
              name="visaType"
              render={({ field: { onChange, value } }) => (
                <components.Dropdown
                  options={visaCategories}
                  selectedValue={value}
                  onSelect={(value: string) => {
                    onChange(value);
                  }}
                  placeholder="Select a visa type"
                  label="Visa Type"
                  error={errors.visaType?.message}
                />
              )}
            />

            {documents.map((document, index) => (
              <View key={index} style={styles.documentContainer}>
                <components.InputField
                  title={`Document ${index + 1}`}
                  placeholder="Enter document name"
                  value={document.name}
                  onChangeText={(text: any) =>
                    handleDocumentChange(text, index)
                  }
                />

                {documents.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeDocument(index)}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color="red"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
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
  addContainer: {
    margin: 20,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: theme.COLORS.black,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
    elevation: 2,
  },
  submitButtonText: {
    ...theme.FONTS.H5,
    color: theme.COLORS.white,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "170%",
  },
  removeButton: {
    marginLeft: 8,
  },
  addButton: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.lightGray,
    alignItems: "center",
  },
  addButtonText: {
    ...theme.FONTS.H5,
    color: theme.COLORS.black,
  },
});

export default AddChecklist;
