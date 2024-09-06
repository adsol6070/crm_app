import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  TextInput,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  Bubble,
  GiftedChat,
  IMessage,
  Send,
  InputToolbar,
  Actions,
  SystemMessage,
} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { theme } from "../../constants/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useSocket } from "../../common/context/SocketContext";
import { useAuth } from "../../common/context/AuthContext";
import { chatService } from "../../api/chat";

type RootStackParamList = {
  PersonalChat: { userName: string; userId: string };
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
  const { userId, userName } = route.params;
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const socketManager = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [originalMessages, setOriginalMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const mapMessages = (chatHistory: any[]): IMessage[] => {
    return chatHistory
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .map((message) => ({
        _id: message.id,
        text: message.message,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.fromUserId,
          name: message.fromUserId === user?.sub ? "You" : userName,
          avatar: "https://avatar.iran.liara.run/public/boy",
        },
        sent: message.fromUserId === user?.sub,
        received: message.fromUserId !== user?.sub,
        ...(message.chatFileUrl && { image: message.chatFileUrl }),
      }));
  };

  const addMessage = (messages: IMessage[]) => {
    console.log("Add Message get called:", messages);
    socketManager?.emit("sendMessage", {
      toUserId: userId,
      message: messages[0].text,
    });
  };

  const onDeleteMessage = (messageId: string, messageSenderId: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete For Me",
          style: "destructive",
          onPress: () => {
            socketManager?.emit("deleteMessageForMe", { messageId });

            setMessages((previousMessages) =>
              previousMessages.filter((msg) => msg._id !== messageId)
            );

            socketManager?.emit("deleteMessageForEveryone", {
              messageId,
              userId,
            });
          },
        },
        {
          text: "Delete for Everyone",
          onPress: () => {
            if (messageSenderId === user?.sub) {
              // Delete message for everyone if the message was sent by the current user
              socketManager?.emit("deleteMessageForEveryone", {
                messageId,
                userId,
              });
              // Remove message locally
              setMessages((previousMessages) =>
                previousMessages.filter((msg) => msg._id !== messageId)
              );
            } else {
              Alert.alert(
                "Error",
                "You can only delete messages sent by you for everyone."
              );
            }
          },
        },
      ]
    );
  };

  const copyToClipboard = (messageText: string) => {
    Clipboard.setString(messageText);
    Alert.alert(
      "Copied to Clipboard",
      "The message has been copied to clipboard."
    );
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === "") {
      setMessages(originalMessages);
    } else {
      const filteredMessages = originalMessages.filter(
        (message) =>
          message.text &&
          message.text.toLowerCase().includes(text.toLowerCase())
      );
      setMessages(filteredMessages);
    }
  };

  const handleTyping = (text: string) => {
    const isTyping = text.trim().length > 0;

    if (isTyping) {
      socketManager?.emit("startTyping", { userId });
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socketManager?.emit("stopTyping", { userId: userId });
    }, 500);
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const chatImage = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || "unknown",
        type: result.assets[0].mimeType || "image/jpeg",
        size: result.assets[0].fileSize || 0,
      };

      const formData = new FormData();
      formData.append("uploadType", "ChatMessageFiles");
      formData.append("chatFile", chatImage);
      const response = await chatService.uploadChatFile(formData);

      const newMessage = {
        fileUrl: response.fileUrl,
        fileName: response.fileName,
        fileType: response.fileType,
        fileSize: response.fileSize,
        fromUserId: user?.sub,
        toUserId: userId,
      };

      socketManager?.emit("sendFileMessage", newMessage);
    }
  };

  const handleDocumentPicker = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/*",
      });
      if (!res.canceled) {
        const chatDocument = {
          uri: res.assets[0].uri,
          name: res.assets[0].name || "unknown",
          type: res.assets[0].mimeType,
          size: res.assets[0].size || 0,
        };

        const formData = new FormData();
        formData.append("uploadType", "ChatMessageFiles");
        formData.append("chatFile", chatDocument);
        const response = await chatService.uploadChatFile(formData);

        const newMessage = {
          fileUrl: response.fileUrl,
          fileName: response.fileName,
          fileType: response.fileType,
          fileSize: response.fileSize,
          fromUserId: user?.sub,
          toUserId: userId,
        };

        socketManager?.emit("sendFileMessage", newMessage);
      }
    } catch (err) {
      console.error("Error picking document: ", err);
    }
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
    const { currentMessage } = props;
    const fileUrl = currentMessage?.image;

    const isImageUrl = (url: string) => {
      return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
    };

    const isImage = isImageUrl(fileUrl);
    const isDocument = !isImage && fileUrl;

    if (isDocument) {
      return (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(fileUrl);
          }}
          onLongPress={() => {
            Alert.alert("Message Options", "Choose an option", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                onPress: () =>
                  onDeleteMessage(currentMessage._id, currentMessage.user._id),
              },
            ]);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
            marginBottom: 5,
          }}
        >
          <MaterialIcons name="attach-file" size={24} color="black" />
          <Text
            style={{
              marginLeft: 5,
              color: "black",
              textDecorationLine: "underline",
            }}
          >
            {currentMessage.fileName || "Document"}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: theme.COLORS.gray1,
            },
            left: {
              backgroundColor: "gray",
            },
          }}
          textStyle={{
            right: {
              ...theme.FONTS.H5,
            },
            left: {
              ...theme.FONTS.H5,
            },
          }}
          onLongPress={() => {
            Alert.alert("Message Options", "Choose an option", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Copy",
                onPress: () => copyToClipboard(currentMessage.text),
              },
              {
                text: "Delete",
                onPress: () =>
                  onDeleteMessage(currentMessage._id, currentMessage.user._id),
              },
            ]);
          }}
        />
        <TouchableOpacity
          style={{ marginHorizontal: 4, padding: 4, borderRadius: 50 }}
          onPress={() => {
            const options = [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                onPress: () =>
                  onDeleteMessage(currentMessage._id, currentMessage.user._id),
              },
            ];

            if (!isDocument && !isImage) {
              options.push({
                text: "Copy",
                onPress: () => copyToClipboard(currentMessage.text),
              });
            }

            Alert.alert("Message Options", "Choose an option", options);
          }}
        >
          <Entypo
            name="dots-three-vertical"
            size={15}
            color={theme.COLORS.gray1}
          />
        </TouchableOpacity>
      </>
    );
  };

  const renderInputToolbar = (props: any) => {
    return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
  };

  const renderActions = (props: any) => {
    return (
      <Actions
        {...props}
        icon={() => (
          <MaterialIcons
            name="add-circle"
            size={30}
            color={theme.COLORS.black}
          />
        )}
        onPressActionButton={() => {
          Alert.alert("Select File", "Choose a file to send", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Image",
              onPress: handleImagePicker,
            },
            {
              text: "Document",
              onPress: handleDocumentPicker,
            },
          ]);
        }}
      />
    );
  };

  const renderSystemMessage = (props: any) => {
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: theme.COLORS.black, fontSize: 14 }}
      />
    );
  };

  const renderInput = () => {
    if (!showSearchInput) {
      return (
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={() => {
            setShowSearchInput(true);
          }}
        >
          <FontAwesome name="search" size={24} color="black" />
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={handleSearch}
          returnKeyType="search"
          onBlur={() => setShowSearchInput(false)}
        />
        <TouchableOpacity
          style={styles.closeIconContainer}
          onPress={() => {
            setSearchText("");
            setShowSearchInput(false);
          }}
        >
          <MaterialIcons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    socketManager?.emit("fetchChatHistory", { userId: userId });

    socketManager?.on("chatHistory", (chatHistory: any[]) => {
      const mappedMessages = mapMessages(chatHistory);
      setMessages(mappedMessages);
      setOriginalMessages(mappedMessages);
    });

    socketManager?.on("receiveMessage", async (newMessage: any) => {
      const updatedMessage = {
        _id: newMessage.id,
        text: newMessage.message,
        createdAt: newMessage.chatFileUrl
          ? new Date()
          : new Date(newMessage.timestamp),
        user: {
          _id: newMessage.fromUserId,
          name: newMessage.fromUserId === user?.sub ? "You" : userName,
          avatar: "https://avatar.iran.liara.run/public/boy",
        },
        sent: newMessage.fromUserId === user?.sub,
        received: newMessage.fromUserId !== user?.sub,
        ...(newMessage.chatFileUrl && { image: newMessage.chatFileUrl }),
      };
      if (
        (newMessage.fromUserId === userId &&
          newMessage.toUserId === user?.sub) ||
        (newMessage.toUserId === userId && newMessage.fromUserId === user?.sub)
      ) {
        setMessages((prevMessages) =>
          [...prevMessages, updatedMessage].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        );
        setOriginalMessages((prevMessages) =>
          [...prevMessages, updatedMessage].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          )
        );
        socketManager.emit("messageRead", {
          fromUserId: newMessage.fromUserId,
        });
      } else {
        socketManager.emit("getUnreadMessages");
      }
    });

    socketManager?.on("typing", ({ user }) => {
      if (user.id === userId) {
        setIsTyping(true);
      }
    });

    socketManager?.on("stopTyping", ({ user }) => {
      if (user.id === userId) {
        setIsTyping(false);
      }
    });

    return () => {
      socketManager.off("chatHistory");
      socketManager.off("receiveMessage");
      socketManager.off("typing");
      socketManager.off("stopTyping");
    };
  }, [socketManager, userId]);

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
          {!showSearchInput && (
            <Text style={{ ...theme.FONTS.H4, marginLeft: 8 }}>{userName}</Text>
          )}
        </View>
        {renderInput()}
      </View>
      <GiftedChat
        messages={messages}
        // showUserAvatar={true}
        // renderUsernameOnMessage={true}
        onSend={(messages) => addMessage(messages as IMessage[])}
        user={{
          _id: user?.sub as string,
          name: "You",
          avatar: "https://avatar.iran.liara.run/public/boy",
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderSystemMessage={renderSystemMessage}
        scrollToBottom
        onInputTextChanged={handleTyping}
        isTyping={isTyping}
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
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.gray1,
    backgroundColor: theme.COLORS.white,
  },
  searchIconContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginTop: 2,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    ...theme.FONTS.Mulish_400Regular,
  },
  closeIconContainer: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PersonalChat;
