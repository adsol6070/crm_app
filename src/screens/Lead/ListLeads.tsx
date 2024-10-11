import React, { useEffect, useRef, useState } from "react";
import { Text, Linking, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ListScreen from "../Users/components/ListScreen";
import { leadService } from "../../api/lead";
import { theme } from "../../constants/theme";
import { formatRoleDisplayName } from "../../utils/FormatRoleDisplayName";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type ListLeadsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ListLeads"
>;
import { hasPermission } from "../../utils/HasPermission";
import { usePermissions } from "../../common/context/PermissionContext";

const ListLeads = () => {
  const navigation = useNavigation<ListLeadsNavigationProp>();
  const refreshRef = useRef<() => void>();
  const [visaCategories, setVisaCategories] = useState<any[]>([]);
  const { permissions } = usePermissions();

  useEffect(() => {
    getVisaCategories();
  }, []);

  const getVisaCategories = async () => {
    try {
      const response: any = await leadService.getVisaCategory();
      const newCategories = response.map((category: any) => {
        return {
          value: category.category,
          label: formatRoleDisplayName(category.category),
        };
      });
      setVisaCategories([{ value: "all", label: "All" }, ...newCategories]);
    } catch (error) {
      console.error("Error fetching visa categories", error);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this lead?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await leadService.deleteLead(id);
              refreshRef.current?.();
            } catch (error) {
              console.error("Error deleting lead:", error);
            }
          },
        },
      ]
    );
  };

  const handleItemPress = (id: string) => {
    navigation.navigate("LeadDetail", { leadId: id });
  };

  return (
    <ListScreen
      title="Leads"
      fetchData={leadService.getAllLeads}
      placeholder="Search Lead..."
      addButtonDestination="AddLead"
      onItemPress={(item) => handleItemPress(item.id)}
      centerComponent={(item) => {
        return <Text style={theme.FONTS.H4}>{item.firstname}</Text>;
      }}
      skeletonWithImage={false}
      actionConfigs={[
        {
          iconName: "email",
          iconType: "MaterialIcons",
          onPress: (item) => Linking.openURL(`mailto:${item.email}`),
          size: 20,
        },
        {
          iconName: "phone",
          iconType: "MaterialIcons",
          onPress: (item) => Linking.openURL(`tel:${item.phone}`),
          size: 20,
        },
        {
          iconName: "settings",
          iconType: "MaterialIcons",
          onPress: (item) =>
            navigation.navigate("LeadActions", {
              leadId: item.id,
              visaType: item.visaCategory,
            }),
          size: 20,
        },
        ...(hasPermission(permissions, 'Leads', 'Delete') ? [{
          iconName: "delete",
          iconType: "MaterialIcons",
          onPress: (item) => handleDelete(item.id),
          size: 20,
        }] : []),
      ]}
      refreshRef={refreshRef}
      isFilterable
      filterOptions={visaCategories}
      filterProperty="visaCategory"
      searchKey="firstname"
      deleteAllData={leadService.deleteAllLeads}
      listPermissions={{
        module: "Leads",
        permissions: {
          DeleteAllButton: "DeleteAll",
        },
      }}
      showDeleteAll={true}
    />
  );
};

export default ListLeads;
