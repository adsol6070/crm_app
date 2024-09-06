import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Linking,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { userService } from "../../api/user";
import SkeletonLoader from "./SkeletonLoader";
import GetPlaceholderImage from "../../utils/GetPlaceholderImage ";
import Header1 from "../../components/Header1";

const UserList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = filteredUsers.filter((user) =>
      user.userName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userList = await userService.getAllUsers();
      const modifiedUsers = userList.users.map((user) => ({
        id: user.id,
        userImg: user.profileImageUrl,
        userName: `${user.firstname} ${user.lastname}`,
        role: user.role,
        phoneNumber: user.phone,
      }));

      setFilteredUsers(modifiedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const handleCall = () => {
      if (item.phoneNumber) {
        Linking.openURL(`tel:${item.phoneNumber}`);
      }
    };

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate("UserDetail", { userId: item.id })}
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
          {item.userImg && item.userImg !== "" ? (
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
            <Text
              style={{ ...theme.FONTS.Mulish_400Regular, color: "#808080" }}
            >
              {item.role}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleCall} style={styles.iconButton}>
              <MaterialIcons name="call" size={20} color={theme.COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UserDetail", { userId: item.id })
              }
              style={styles.iconButton}
            >
              <AntDesign name="eye" size={20} color={theme.COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAddButton = () => {
    if (filteredUsers.length === 0 && !loading) {
      return (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddUsers")}
          >
            <AntDesign
              name="pluscircleo"
              size={50}
              color={theme.COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.addButtonText}>
            Click here to add the first user now.
          </Text>
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header1
          title="Users"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          {...(filteredUsers.length > 0
            ? {
                actionIcon: "plus",
                onActionPress: () => navigation.navigate("AddUsers"),
              }
            : {})}
        />
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
        <View style={styles.countContainer}>
          {loading ? (
            <SkeletonLoader countOnly={true} />
          ) : (
            <Text style={styles.countText}>
              {" "}
              {filteredUsers.length === 0
                ? "0 Users found"
                : `${filteredUsers.length} ${
                    filteredUsers.length === 1 ? "User" : "Users"
                  }`}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} withImage={true} />
            ))
          ) : filteredUsers.length === 0 ? (
            <View style={styles.addButtonContainer}>{renderAddButton()}</View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}
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
  countContainer: {
    marginHorizontal: 22,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  countText: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 150,
    backgroundColor: theme.COLORS.white,
  },
  addButton: {
    marginBottom: 10,
  },
  addButtonText: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
  },
});

export default UserList;
