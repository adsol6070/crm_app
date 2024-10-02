import { Alert, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../constants/theme";
import ListScreen from "../../Users/components/ListScreen";
import { checklistService } from "../../../api/checklist";
import { useRef } from "react";

const ViewChecklist = () => {
  const navigation = useNavigation();
  const refreshRef = useRef<() => void>();

  const handleItemPress = (item: any) => {
    navigation.navigate("ChecklistDetail", {
      visaType: item.visaType,
      checklistId: item.id,
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this checklist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await checklistService.deleteChecklistById(id);
              refreshRef.current?.();
            } catch (error) {
              console.error("Error deleting checklist:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <ListScreen
      title="Checklists"
      fetchData={checklistService.getAllChecklist}
      placeholder="Search Checklist..."
      skeletonWithImage={false}
      onItemPress={handleItemPress}
      centerComponent={(item) => (
        <Text style={theme.FONTS.H4}>{item.visaType}</Text>
      )}
      actionConfigs={[
        {
          iconName: "eye",
          iconType: "AntDesign",
          onPress: (item) => handleItemPress(item),
          size: 20,
        },
        {
          iconName: "delete",
          iconType: "MaterialIcons",
          onPress: (item) => handleDelete(item.id),
          size: 20,
        },
      ]}
      searchKey="visaType"
      refreshRef={refreshRef}
    />
  );
};

export default ViewChecklist;
