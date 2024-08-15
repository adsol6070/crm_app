import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../client";

interface UserPayload {
  userId: string | undefined;
}

interface ProfileResponse {
  id: string;
  city: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  address: string;
}

const getAuthHeaders = async (isMultipart: boolean = false) => {
  const token = await AsyncStorage.getItem("accessToken");
  let headers: { [key: string]: string } = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (isMultipart) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  return headers;
}

class UserService {

  async getProfile(payload: UserPayload): Promise<ProfileResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await httpClient.post<ProfileResponse>(
        "/users/profile",
        payload, 
        { headers }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error("UserService Error:", error);
  }
}

const userService = new UserService();

export { userService };
