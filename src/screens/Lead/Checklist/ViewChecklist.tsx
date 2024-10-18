import { Alert, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../constants/theme";
import ListScreen from "../../Users/components/ListScreen";
import { checklistService } from "../../../api/checklist";
import { useRef } from "react";
import { formatRoleDisplayName } from "../../../utils/FormatRoleDisplayName";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type ViewChecklistNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewChecklist"
>;
import { usePermissions } from "../../../common/context/PermissionContext";
import { hasPermission } from "../../../utils/HasPermission";

const ViewChecklist = () => {
  const navigation = useNavigation<ViewChecklistNavigationProp>();
  const refreshRef = useRef<(() => void) | undefined>(undefined);
  const { permissions } = usePermissions();

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
        <Text style={theme.FONTS.H4}>
          {formatRoleDisplayName(item.visaType)}
        </Text>
      )}
      actionConfigs={[
        {
          iconName: "eye",
          iconType: "AntDesign",
          onPress: (item) => handleItemPress(item),
          size: 20,
        },
        ...(hasPermission(permissions, 'Checklists', 'DeleteChecklist') ? [{
          iconName: "delete",
          iconType: "MaterialIcons",
          onPress: (item: any) => handleDelete(item.id),
          size: 20,
        }] : []),
      ]}
      searchKey="visaType"
      refreshRef={refreshRef}
    />
  );
};

export default ViewChecklist;
