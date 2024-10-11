import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { rolesService } from "../../../../api/roles";
import { theme } from "../../../../constants/theme";
import { formatRoleDisplayName } from "../../../../utils/FormatRoleDisplayName";
import ListScreen from "../../components/ListScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/AppNavigator";

type RoleListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewRoles"
>;

const RoleList = () => {
  const navigation = useNavigation<RoleListNavigationProp>();

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
      addButtonDestination="RoleManager"
      skeletonWithImage={false}
      onItemPress={(item) => handleItemPress(item.name)}
      centerComponent={(item) => (
        <Text style={theme.FONTS.H4}>{formatRoleDisplayName(item.name)}</Text>
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
