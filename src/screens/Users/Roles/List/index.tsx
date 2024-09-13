import { useNavigation } from "@react-navigation/native";
import { rolesService } from "../../../../api/roles";
import ListScreen from "../../components/ListScreen";
import { Text, View } from "react-native";
import { theme } from "../../../../constants/theme";

const RoleList = () => {
  const navigation = useNavigation();

  const handleItemPress = (name: string) =>
    navigation.navigate("RoleDetail", { roleName: name });

  return (
    <ListScreen
      title="Roles"
      fetchData={rolesService.getAllRoles}
      mapData={(roles) =>
        roles.map((role: string, index: number) => ({
          id: index + 1,
          name: role,
        }))
      }
      placeholder="Search Role..."
      noDataMessage="0 Roles found"
      addButtonDestination="RoleManager"
      skeletonWithImage={false}
      onItemPress={(item) => handleItemPress(item.name)}
      centerComponent={(item) => (
        <Text style={theme.FONTS.H4}>{item.name}</Text>
      )}
      actionConfigs={[
        {
          iconName: "eye",
          iconType: "AntDesign",
          onPress: (item) => handleItemPress(item.name),
          size: 20,
        },
      ]}
      searchKey="name"
    />
  );
};

export default RoleList;
