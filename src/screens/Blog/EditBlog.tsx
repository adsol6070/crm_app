import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { components } from "../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RefreshControl } from "react-native-gesture-handler";
import { blogService } from "../../api/blog";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { theme } from "../../constants/theme";
import Header1 from "../../components/Header1";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

interface ImageObject {
  uri: string;
  name: string;
  type: string;
  size: number;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Short description is required"),
  content: yup.string(),
  category: yup.string().required("Category is required"),
  blogImage: yup.mixed(),
});

type EditBlogNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditBlog"
>;
type EditBlogRouteProp = RouteProp<RootStackParamList, "EditBlog">;

const EditBlog = () => {
  const route = useRoute<EditBlogRouteProp>();
  const navigation = useNavigation<EditBlogNavigationProp>();
  const { blogId }: any = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<ImageObject | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const getCategories = async () => {
    try {
      const response: any = await blogService.getBlogCategory();
      const newCategories = response.map((category: any) => {
        return {
          value: category.category,
          label: capitalizeFirstLetter(category.category),
        };
      });

      setCategories(newCategories);
    } catch (error) {
      console.error("Error fetching blog categories", error);
    }
  };

  const getBlogDetails = async () => {
    try {
      const response: any = await blogService.getBlogById(blogId);
      reset({
        title: response.title,
        description: response.description,
        category: response.category,
      });
      setContent(response.content);
    } catch (error) {
      console.error("Error fetching blog details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getBlogDetails();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getBlogDetails();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleImageSelect = (image: any) => {
    const profileImage: ImageObject = {
      uri: image.uri,
      name: image.fileName || "unknown",
      type: image.mimeType || "image/jpeg",
      size: image.fileSize || 0,
    };

    setImage(profileImage);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("content", content);
      formData.append("category", data.category);
      formData.append("uploadType", "Blog");

      if (image) {
        formData.append("blogImage", image);
      }
      await blogService.updateBlogById(blogId, formData);
      Alert.alert("Blog Updated Successfully");
    } catch (error) {
      console.log("Error updating blog ", error);
    }
  };

  const renderHeader = () => {
    return (
      <Header1
        title="Edit Blog"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.fieldContainer}>
        <View>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <components.InputField
                title="Title"
                placeholder="Enter the title of the blog"
                customBorderColor="#ddd"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.title?.message}
              />
            )}
          />
        </View>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Short Description"
              placeholder="Write the Short Description"
              customBorderColor="#ddd"
              multiline={true}
              numberOfLines={5}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.description?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <components.Dropdown
              options={categories}
              selectedValue={value}
              onSelect={(value: string) => {
                onChange(value);
              }}
              placeholder="Select a category"
              label="Category"
              error={errors.category?.message}
            />
          )}
        />
        <View>
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, onBlur, value } }) => (
              <components.InputField
                title="Content"
                useRichTextEditor
                richEditorPlaceholder="Write your content here..."
                initialContent={content}
                onRichTextChange={(text) => {
                  setContent(text);
                  onChange(text);
                }}
                error={errors.content?.message}
              />
            )}
          />
        </View>
        <Controller
          control={control}
          name="blogImage"
          render={() => (
            <components.InputField
              title="Upload Image"
              placeholder="Select an image"
              image={true}
              imageUri={image?.uri}
              containerStyle={{ marginTop: 25 }}
              onImageSelect={handleImageSelect}
              error={errors.blogImage?.message}
            />
          )}
        />
        <components.Button
          title="Update Blog"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? <components.Spinner /> : renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  fieldContainer: {
    margin: 20,
  },
});

export default EditBlog;
