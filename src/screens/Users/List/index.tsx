import { useNavigation } from "@react-navigation/native";
import { Image, Linking, Text, View } from "react-native";
import { userService } from "../../../api/user";
import ListScreen from "../components/ListScreen";
import { theme } from "../../../constants/theme";
import GetPlaceholderImage from "../../../utils/GetPlaceholderImage ";
import { formatRoleDisplayName } from "../../../utils/FormatRoleDisplayName";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import { hasPermission } from "../../../utils/HasPermission";

type UserListNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewUsers"
>;

const UserList = () => {
  const navigation = useNavigation<UserListNavigationProp>();
  hasPermission;

  const handleItemPress = (id: string) => {
    navigation.navigate("UserDetail", { userId: id });
  };

  return (
    <ListScreen
      title="Users"
      fetchData={userService.getAllUsers}
      mapData={(users) =>
        users.map((user) => ({
          id: user.id,
          userImg: user.profileImageUrl,
          userName: `${user.firstname} ${user.lastname}`,
          role: user.role,
          phoneNumber: user.phone,
        }))
      }
      placeholder="Search User..."
      addButtonDestination="UserManager"
      onItemPress={(item) => handleItemPress(item.id)}
      leadingComponent={(item) => (
        <>
          {item.userImg ? (
            <Image
              source={{ uri: item.userImg }}
              resizeMode="contain"
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
            />
          ) : (
            <GetPlaceholderImage name={item.userName.split(" ")[0]} />
          )}
        </>
      )}
      centerComponent={(item) => (
        <View style={{ flexDirection: "column" }}>
          <Text style={theme.FONTS.H4}>{item.userName}</Text>
          <Text style={theme.FONTS.Mulish_400Regular}>
            {formatRoleDisplayName(item.role)}
          </Text>
        </View>
      )}
      actionConfigs={[
        {
          iconName: "call",
          iconType: "MaterialIcons",
          onPress: (item) => Linking.openURL(`tel:${item.phoneNumber}`),
          size: 20,
        },
        {
          iconName: "eye",
          iconType: "AntDesign",
          onPress: (item) => handleItemPress(item.id),
          size: 20,
        },
      ]}
      searchKey="userName"
    />
  );
};

export default UserList;
