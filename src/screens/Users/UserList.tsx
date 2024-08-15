import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const userData: any[] = [
  {
    id: "1",
    userImg: "https://avatar.iran.liara.run/public/boy",
    userName: "John Doe",
    role: "Admin",
  },
  {
    id: "2",
    userImg: "https://via.placeholder.com/100",
    userName: "Jane Smith",
    role: "Super Admin",
  },
  {
    id: "3",
    userImg: "https://via.placeholder.com/100",
    userName: "Bob Johnson",
    role: "Manager",
  },
  {
    id: "4",
    userImg: "https://via.placeholder.com/100",
    userName: "Alice Williams",
    role: "Manager",
  },
  {
    id: "5",
    userImg: "https://via.placeholder.com/100",
    userName: "Charlie Brown",
    role: "Manager",
  },
  {
    id: "6",
    userImg: "https://via.placeholder.com/100",
    userName: "Eve Adams",
    role: "Admin",
  },
  {
    id: "7",
    userImg: "https://via.placeholder.com/100",
    userName: "Frank Miller",
    role: "Admin",
  },
  {
    id: "8",
    userImg: "https://via.placeholder.com/100",
    userName: "Grace Lee",
    role: "Manager",
  },
  {
    id: "9",
    userImg: "https://via.placeholder.com/100",
    userName: "Hannah Davis",
    role: "Manager",
  },
  {
    id: "10",
    userId: "",
    userImg: "https://via.placeholder.com/100",
    userName: "Ian Wilson",
    role: "Admin",
  },
];

const UserList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState(userData);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = userData.filter((user) =>
      user.userName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() =>
        navigation.navigate("UserDetail", { userName: item.userName })
      }
      style={[
        {
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 22,
          borderBottomColor: theme.COLORS.secondaryWhite,
          borderBottomWidth: 1,
        },
        index % 2 !== 0
          ? {
              backgroundColor: theme.COLORS.tertiaryWhite,
            }
          : null,
      ]}
    >
      <View
        style={{
          paddingVertical: 15,
          marginRight: 22,
        }}
      >
        <Image
          source={{ uri: item.userImg }}
          resizeMode="contain"
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={{ ...theme.FONTS.H4, marginBottom: 4 }}>
            {item.userName}
          </Text>
          <Text style={{ fontSize: 14, color: "#808080" }}>{item.role}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => console.log("Edit get called")}
            style={styles.iconButton}
          >
            <AntDesign name="edit" size={20} color={theme.COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("Delete get called")}
            style={styles.iconButton}
          >
            <MaterialIcons name="delete" size={20} color={theme.COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 22,
            marginTop: 22,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.COLORS.black}
            />
          </TouchableOpacity>
          <Text style={{ ...theme.FONTS.H4 }}>Users</Text>

          <TouchableOpacity onPress={() => navigation.navigate("AddUsers")}>
            <AntDesign name="plus" size={20} color={theme.COLORS.black} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: 22,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.COLORS.secondaryWhite,
            height: 48,
            marginVertical: 22,
            paddingHorizontal: 12,
            borderRadius: 22,
          }}
        >
          <Ionicons name="search" size={24} color={theme.COLORS.black} />
          <TextInput
            style={{ width: "100%", height: "100%", marginHorizontal: 12 }}
            value={search}
            onChangeText={handleSearch}
            placeholder="Search user..."
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 5,
  },
});

export default UserList;
