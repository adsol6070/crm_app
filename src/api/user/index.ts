import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../client";
import { IUser as IProfileResponse } from "../../types";

interface UserPayload {
  userId: string | undefined;
}

const getAuthHeaders = async (isMultipart: boolean = false) => {
  const token = await AsyncStorage.getItem("accessToken");
  let headers: { [key: string]: string } = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isMultipart) {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
};

const makeRequest = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  isMultipart: boolean = false
): Promise<T> => {
  const headers = await getAuthHeaders(isMultipart);
  try {
    let response;
    if (method === "get" || method === "delete") {
      response = await httpClient[method](url, { headers });
    } else {
      response = await httpClient[method](url, data, { headers });
    }
    return response.data;
  } catch (error) {
    console.error(`Request Error (${method.toUpperCase()} ${url}):`, error);
    throw error;
  }
};

class UserService {
  async getProfile(payload: UserPayload): Promise<IProfileResponse> {
    return makeRequest("post", "/users/profile", payload);
  }

  async createUser(payload: FormData) {
    return makeRequest<void>("post", "/users/", payload, true);
  }

  async getAllUsers() {
    return makeRequest<any[]>("get", "/users/");
  }

  async getUser(userId: string): Promise<any> {
    return makeRequest<any>("get", `/users/${userId}`);
  }

  async updateUser(payload: any, userId: string): Promise<void> {
    return makeRequest<void>("patch", `/users/${userId}`, payload);
  }

  async deleteUser(userId: string): Promise<void> {
    return makeRequest<void>("delete", `/users/${userId}`);
  }

  async updateProfileImage(userId: string, image: File): Promise<void> {
    const formData = new FormData();
    formData.append("uploadType", "User");
    formData.append("profileImage", image);

    return makeRequest<void>(
      "patch",
      `/users/${userId}/profile-image`,
      formData,
      true
    );
  }
}

const userService = new UserService();

export { userService };
