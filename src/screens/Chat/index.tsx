import React, { useCallback, useEffect, useState } from "react";
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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";
import { useSocket } from "../../common/context/SocketContext";
import GetPlaceholderImage from "../../utils/GetPlaceholderImage ";
import SkeletonLoader from "../Users/SkeletonLoader";

interface ChatUser {
  id: string;
  userImg: string;
  userName: string;
  lastSeen: string;
  isOnline: boolean;
}

const mapUserData = (data): ChatUser[] => {
  return data.map((user: any) => ({
    id: user.id,
    userImg: user.profileImageUrl,
    userName: `${user.firstname} ${user.lastname}`,
    lastSeen: user.online
      ? "Online"
      : user.last_active
      ? `Last seen ${new Date(user.last_active).toLocaleTimeString()}`
      : "Last seen recently",
    isOnline: user.online || false,
  }));
};

const Chat = () => {
  const navigation = useNavigation();
  const socketManager = useSocket();
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[] | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<Map<string, number>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);

  const fetchInitialUsers = useCallback(() => {
    setLoading(true);
    socketManager?.emit("requestInitialUsers");
    socketManager?.emit("getUnreadMessages");
    socketManager.on("initialUsers", async (users: any[]) => {
      const mappedUsers = mapUserData(users);
      setFilteredUsers(mappedUsers);
      setLoading(false);
    });

    socketManager?.on("unreadMessagesCount", ({ unreadMessagesMap }) => {
      setUnreadMessages(new Map(Object.entries(unreadMessagesMap)));
    });

    socketManager?.on("messageRead", ({ fromUserId }) => {
      setUnreadMessages((prev) => {
        const updated = new Map(prev);
        updated.delete(fromUserId);
        return updated;
      });
    });

    return () => {
      socketManager.off("initialUsers");
      socketManager.off("unreadMessagesCount");
    };
  }, [socketManager]);

  useFocusEffect(
    useCallback(() => {
      fetchInitialUsers();
      return () => {
        socketManager.off("initialUsers");
      };
    }, [fetchInitialUsers, socketManager])
  );

  const activeUsers = () =>
    filteredUsers ? filteredUsers.filter((user) => user.isOnline) : [];

  const handleSearch = (text: string) => {
    setSearch(text);
    if (filteredUsers) {
      const filteredData = filteredUsers.filter((user) =>
        user.userName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filteredData);
    }
  };

  const userChatOpen = (user: ChatUser) => {
    navigation.navigate("PersonalChat", {
      userName: user.userName,
      userId: user.id,
    });
    socketManager?.emit("messageRead", { fromUserId: user.id });
    setUnreadMessages((prev) => {
      const updated = new Map(prev);
      updated.delete(user.id);
      return updated;
    });
  };

  const renderItem: ListRenderItem<ChatUser> = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      onPress={() => userChatOpen(item)}
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
      </View>
      <View style={{ flexDirection: "column", flex: 1 }}>
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
      {unreadMessages.get(item.id) > 0 && (
        <View
          style={{
            backgroundColor: "red",
            borderRadius: 10,
            height: 20,
            width: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>
            {unreadMessages.get(item.id)}
          </Text>
        </View>
      )}
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

    socketManager?.on("receiveMessage", async (newMessage: any) => {
      console.log("Called..........");
      socketManager.emit("getUnreadMessages");
    });

    return () => {
      socketManager.emit("receiveMessage");
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
        {loading || filteredUsers === null ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader key={index} withImage={true} />
          ))
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
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
