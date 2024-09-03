import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { components } from "../../components";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RefreshControl } from "react-native-gesture-handler";
import Header1 from "../../components/Header1";

const AddBlog = () => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    shortDescription: yup.string().required("Short description is required"),
    category: yup.string().required("Category is required"),
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reset();
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

  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    reset();
  };

  const renderHeader = () => {
    return <components.Header title="Add Blog" goBack={true} />;
  };

  const renderContent = () => {
    return (
      <View style={styles.fieldContainer}>
        <View style={{ marginTop: 30, marginBottom: 30 }}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <components.InputField
                title="Title"
                placeholder="Enter the title of the blog"
                customBorderColor="#ddd"
                customBackgroundColor="#f5f5f5"
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
          name="shortDescription"
          render={({ field: { onChange, onBlur, value } }) => (
            <components.InputField
              title="Short Description"
              placeholder="Write the Short Description"
              customBorderColor="#ddd"
              customBackgroundColor="#f5f5f5"
              multiline={true}
              numberOfLines={5}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.shortDescription?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange } }) => (
            <components.Dropdown
              options={["Option 1", "Option 2", "Option 3"]}
              selectedValue={selectedValue}
              onSelect={(value: string) => {
                handleSelect(value);
                onChange(value);
              }}
              error={errors.category?.message}
              placeholder="Select an option"
              label="Category"
            />
          )}
        />
        <View>
          <Text>Content</Text>
          <components.TextEditor />
        </View>
        <View>
          <Text>Upload Image</Text>
          <components.ImagePickerComponent />
        </View>
        <components.Button title="Add Blog" onPress={handleSubmit(onSubmit)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header1
          title="Add Blog"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  fieldContainer: {
    margin: 20,
  },
});

export default AddBlog;
