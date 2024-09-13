import React, { useEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { userService } from "../../../api/user";
import UserForm from "./Form";
import { Alert } from "react-native";

interface ImageObject {
  uri: string;
  name: string;
  type: string;
  size: number;
}

type UserManagerRouteParams = {
  params?: {
    userId?: string;
  };
};

type UserData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  role: string;
};

const UserManager = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<UserManagerRouteParams, "params">>();
  const { userId } = route.params || {};
  const isEditMode = !!userId;
  const [initialData, setInitialData] = useState<Partial<UserData> | null>(
    null
  );
  const [image, setImage] = useState<ImageObject | null>(null);
  const [countryCode, setCountryCode] = useState<string>("+91");

  useEffect(() => {
    if (isEditMode && userId) {
      const fetchUser = async () => {
        try {
          const user = await userService.getUser(userId);
          const [code, number] = user.phone.split(" ", 2);
          setInitialData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: number,
            city: user.city,
            address: user.address,
            role: user.role,
          });
          setCountryCode(code);
        } catch (error) {
          Alert.alert("Error", "Failed to fetch user data.");
        }
      };
      fetchUser();
    }
  }, [isEditMode, userId]);

  const onSubmit = async (data: Partial<UserData>) => {
    const modifiedData = {
      ...data,
      phone: `${countryCode} ${data.phone}`,
    };

    try {
      if (isEditMode && userId) {
        await userService.updateUser(modifiedData, userId);
        Alert.alert("Success", "User updated successfully.");
      } else {
        const fileData = image ? { profileImage: image } : {};
        const additionalData = {
          uploadType: "User",
        };
        const formData = prepareFormData(
          modifiedData,
          fileData,
          additionalData
        );

        await userService.createUser(formData);
        Alert.alert("Success", "User created successfully.");
      }
      navigation.navigate("ViewUsers");
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <UserForm
      onSubmit={onSubmit}
      initialData={initialData}
      isEditMode={isEditMode}
      image={image}
      setImage={setImage}
      countryCode={countryCode}
      setCountryCode={setCountryCode}
    />
  );
};

const prepareFormData = (
  data: Record<string, any>,
  fileData: Record<string, any> = {},
  additionalData: Record<string, any> = {}
): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  Object.keys(additionalData).forEach((key) => {
    if (additionalData[key] !== undefined && additionalData[key] !== null) {
      formData.append(key, additionalData[key]);
    }
  });

  Object.keys(fileData).forEach((key) => {
    if (fileData[key]) {
      formData.append(key, fileData[key]);
    }
  });

  return formData;
};

export default UserManager;
