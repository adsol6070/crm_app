import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { components } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { blogService } from "../../api/blog";
import HTMLView from "react-native-htmlview";
import { theme } from "../../constants/theme";
import { skeletonLoader } from "../../components/skeletonLoaders";
import Header1 from "../../components/Header1";

const ReadBlog = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { blogId }: any = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [blogDetail, setBlogDetail] = useState<any>(null);

  const getBlogDetail = async () => {
    try {
      const response: any = await blogService.getBlogById(blogId);
      setBlogDetail(response);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogDetail();
  }, []);

  const renderHeader = () => {
    return <components.Header title="Read Blog" goBack={true} />;
  };

  const renderContent = () => {
    if (!blogDetail) return null;

    return (
      <View style={styles.blogContainer}>
        <Image
          source={{
            uri:
              blogDetail.blogImageUrl ||
              "https://tse2.mm.bing.net/th?id=OIP.sWCvltMZF_s3mjA5sL-RdgHaE8&pid=Api&P=0&h=180",
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{blogDetail.title}</Text>
          </View>
          <Text style={styles.textDesign}>
            {new Date(blogDetail.created_at).toLocaleDateString()} |{" "}
            {blogDetail.category}
          </Text>
          <Text style={styles.shortDescription}>{blogDetail.description}</Text>
          <HTMLView value={blogDetail.content} stylesheet={styles} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <components.Header title="Read Blog" goBack={true} />
          <View style={styles.blogContainer}>
            <skeletonLoader.ReadBlogSkeletonLoader
              width={"100%"}
              height={150}
            />
            <View style={styles.textContainer}>
              <skeletonLoader.ReadBlogSkeletonLoader
                width={"80%"}
                height={30}
              />
              <skeletonLoader.ReadBlogSkeletonLoader
                width={"60%"}
                height={20}
              />
              <skeletonLoader.ReadBlogSkeletonLoader
                width={"100%"}
                height={20}
              />
              <skeletonLoader.ReadBlogSkeletonLoader
                width={"100%"}
                height={200}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header1
        title="Read Blog"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  blogContainer: {
    margin: 10,
  },
  textContainer: {
    margin: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  titleContainer: {
    height: 80,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.COLORS.white,
    backgroundColor: "black",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
  },
  textDesign: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 12,
  },
  shortDescription: {
    fontSize: 14,
    color: "#444444",
    lineHeight: 20,
    margin: 10,
  },
  description: {
    fontSize: 16,
    color: "#444444",
    lineHeight: 22,
    margin: 10,
  },
});

export default ReadBlog;
