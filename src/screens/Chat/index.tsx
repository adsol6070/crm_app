import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  ListRenderItem,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";

interface ChatUser {
  id: string;
  userImg: string;
  userName: string;
  lastSeen: string;
  isOnline: boolean;
}

const chatData: ChatUser[] = [
  {
    id: "1",
    userImg: "https://avatar.iran.liara.run/public/boy",
    userName: "John Doe",
    lastSeen: "Last seen 5 minutes ago",
    isOnline: true,
  },
  {
    id: "2",
    userImg: "https://via.placeholder.com/100",
    userName: "Jane Smith",
    lastSeen: "Last seen 10 minutes ago",
    isOnline: false,
  },
  {
    id: "3",
    userImg: "https://via.placeholder.com/100",
    userName: "Bob Johnson",
    lastSeen: "Last seen 2 hours ago",
    isOnline: false,
  },
  {
    id: "4",
    userImg: "https://via.placeholder.com/100",
    userName: "Alice Williams",
    lastSeen: "Last seen 1 day ago",
    isOnline: true,
  },
  {
    id: "5",
    userImg: "https://via.placeholder.com/100",
    userName: "Charlie Brown",
    lastSeen: "Last seen 3 days ago",
    isOnline: false,
  },
  {
    id: "6",
    userImg: "https://via.placeholder.com/100",
    userName: "Eve Adams",
    lastSeen: "Last seen 6 hours ago",
    isOnline: true,
  },
  {
    id: "7",
    userImg: "https://via.placeholder.com/100",
    userName: "Frank Miller",
    lastSeen: "Last seen 15 minutes ago",
    isOnline: true,
  },
  {
    id: "8",
    userImg: "https://via.placeholder.com/100",
    userName: "Grace Lee",
    lastSeen: "Last seen 20 minutes ago",
    isOnline: false,
  },
  {
    id: "9",
    userImg: "https://via.placeholder.com/100",
    userName: "Hannah Davis",
    lastSeen: "Last seen 3 hours ago",
    isOnline: false,
  },
  {
    id: "10",
    userImg: "https://via.placeholder.com/100",
    userName: "Ian Wilson",
    lastSeen: "Last seen 2 days ago",
    isOnline: true,
  },
];

const Chat = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState(chatData);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const activeUsers = () => chatData.filter((user) => user.isOnline);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = chatData.filter((user) =>
      user.userName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const renderItem: ListRenderItem<ChatUser> = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      onPress={() =>
        navigation.navigate("PersonalChat", { userName: item.userName })
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
      <View style={{ paddingVertical: 15, marginRight: 22 }}>
        {item.isOnline && item.isOnline === true && (
          <View
            style={{
              height: 14,
              width: 14,
              borderRadius: 7,
              backgroundColor: "green",
              borderColor: theme.COLORS.white,
              borderWidth: 2,
              position: "absolute",
              top: 14,
              right: 2,
              zIndex: 1000,
            }}
          ></View>
        )}
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
      <View style={{ flexDirection: "column" }}>
        <Text style={{ ...theme.FONTS.H4, marginBottom: 4 }}>
          {item.userName}
        </Text>
        <Text
          style={{
            color: "#808080",
          }}
        >
          {item.lastSeen}
        </Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 22,
          marginTop: 22,
        }}
      >
        <Text style={{ ...theme.FONTS.H4 }}>Chats</Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => console.log("Add contacts")}>
            <MaterialCommunityIcons
              name="message-badge-outline"
              size={20}
              color={theme.COLORS.black}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <MaterialCommunityIcons
              name="playlist-check"
              size={20}
              color={theme.COLORS.black}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          marginHorizontal: 11,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FlatList
          horizontal={true}
          data={activeUsers()}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{ paddingVertical: 15, marginRight: 22 }}
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
              </TouchableOpacity>
              <Text style={{ ...theme.FONTS.Mulish_400Regular }}>
                {item.userName.substring(0, 5)}...
              </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
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
          borderRadius: 20,
        }}
      >
        <Ionicons name="search-outline" size={24} color={theme.COLORS.black} />
        <TextInput
          style={{ width: "100%", height: "100%", marginHorizontal: 12 }}
          value={search}
          onChangeText={handleSearch}
          placeholder="Search contact..."
        />
      </View>
      <View
        style={{
          flex: 1,
          paddingBottom: keyboardVisible ? 0 : Platform.OS === "ios" ? 90 : 60,
        }}
      >
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
});

export default Chat;
