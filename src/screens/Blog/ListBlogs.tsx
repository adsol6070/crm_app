import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { components } from "../../components";
import { blogService } from "../../api/blog";
import { skeletonLoader } from "../../components/skeletonLoaders";
import { usePermissions } from "../../common/context/PermissionContext";
import { hasPermission } from "../../utils/HasPermission";
import Header1 from "../../components/Header1";
import { theme } from "../../constants/theme";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";

type RootStackParamList = {
  ReadBlog: { blogId: string };
  EditBlog: { blogId: string };
};

const ListBlogs: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);
  const { permissions, refreshPermissions } = usePermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [blogData, setBlogData] = useState<any[]>([]);

  const getBlogData = async () => {
    try {
      const response: any = await blogService.getAllBlogs();
      setBlogData(response);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogData();
    refreshPermissions();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getBlogData();
    refreshPermissions();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const handleDelete = (blogId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this blog?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await blogService.deleteBlogById(blogId);
              getBlogData();
              refreshPermissions();
            } catch (error) {
              console.error("Error deleting lead:", error);
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => {
    return (
      <Header1
            title="Blog Lists"
            showBackButton={true}
            onBackPress={() => navigation.goBack()}
        />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <skeletonLoader.BlogListSkeletonLoader key={index} />
            ))}
        </View>
      );
    }

    return blogData.map((blog) => (
      <View key={blog.id} style={styles.cardContainer}>
        <Image
          source={{
            uri:
              blog.blogImageUrl ||
              "https://tse2.mm.bing.net/th?id=OIP.sWCvltMZF_s3mjA5sL-RdgHaE8&pid=Api&P=0&h=180",
          }}
          style={styles.image}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{blog.title}</Text>
          <Text style={styles.date}>
            {new Date(blog.created_at).toLocaleDateString()} - {blog.category == "Null"? "N/A": capitalizeFirstLetter(blog.category)}
          </Text>
          <Text style={styles.shortDescription} numberOfLines={2}>
            {blog.description}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() =>
                navigation.navigate("ReadBlog", { blogId: blog.id })
              }
            >
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
            <View style={styles.actionContainer}>
              {hasPermission(permissions, "Blogs", "Update") && (
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() =>
                    navigation.navigate("EditBlog", { blogId: blog.id })
                  }
                >
                  <Ionicons name="pencil" size={24} color="blue" />
                </TouchableOpacity>
              )}
              {hasPermission(permissions, "Blogs", "Delete") && (
                <TouchableOpacity
                  style={styles.actionIcon}
                  onPress={() => handleDelete(blog.id)}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  cardContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: theme.COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    margin: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333333",
    ...theme.FONTS.Mulish_700Bold
  },
  date: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 12,
    ...theme.FONTS.Mulish_400Regular
  },
  shortDescription: {
    fontSize: 16,
    color: "#444444",
    lineHeight: 22,
    ...theme.FONTS.Mulish_400Regular
  },
  readMoreButton: {
    marginTop: 12,
    backgroundColor: theme.COLORS.black,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  readMoreText: {
    color: theme.COLORS.white,
    fontSize: 12,
    ...theme.FONTS.Mulish_600SemiBold,
  },
  actionIcon: {
    marginLeft: 8,
  },
});

export default ListBlogs;
