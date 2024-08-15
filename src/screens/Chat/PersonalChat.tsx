import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Bubble, GiftedChat, IMessage, Send } from "react-native-gifted-chat";
import { theme } from "../../constants/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type RootStackParamList = {
  PersonalChat: { userName: string };
};

type PersonalChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PersonalChat"
>;

type PersonalChatRouteProp = RouteProp<RootStackParamList, "PersonalChat">;

type PersonalChatProps = {
  navigation: PersonalChatNavigationProp;
  route: PersonalChatRouteProp;
};

const PersonalChat: React.FC<PersonalChatProps> = ({ navigation, route }) => {
  const { userName } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 1,
      text: "Hello developer",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: "https://avatar.iran.liara.run/public/boy",
      },
    },
  ]);

  const onSend = (messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View
          style={{
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            borderRadius: 18,
            backgroundColor: theme.COLORS.black,
            marginRight: 5,
            marginBottom: 5,
          }}
        >
          <FontAwesome name="send" size={12} color={theme.COLORS.white} />
        </View>
      </Send>
    );
  };

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "red",
          },
        }}
        textStyle={{
          right: {
            color: theme.COLORS.white,
          },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.COLORS.white} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 22,
          backgroundColor: theme.COLORS.white,
          height: 60,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={theme.COLORS.black}
            />
          </TouchableOpacity>
          <Text style={{ ...theme.FONTS.H4, marginLeft: 8 }}>{userName}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => console.log("search")}
            style={{ marginRight: 8 }}
          >
            <MaterialIcons name="search" size={24} color={theme.COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => console.log("Menu")}
            style={{ marginRight: 8 }}
          >
            <MaterialIcons name="menu" size={24} color={theme.COLORS.black} />
          </TouchableOpacity>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages as IMessage[])}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        textInputStyle={{
          borderRadius: 22,
          borderWidth: 1,
          borderColor: theme.COLORS.gray1,
          marginRight: 6,
          paddingHorizontal: 12,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
});

export default PersonalChat;
