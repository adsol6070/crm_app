import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../client";

interface UserPayload {
  userId: string | undefined;
}

interface ProfileResponse {
  id: string;
  tenantID?: string;
  firstname: string;
  lastname: string;
  city: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  isEmailVerified?: string;
  role: string;
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

class RolesService {
  async createRole(payload: any) {
    return makeRequest<void>("post", "/permissions/", payload);
  }

  async getAllRoles() {
    return makeRequest<any[]>("get", "/permissions/roles");
  }

  async getRoleByName(payload: any): Promise<any> {
    return makeRequest<any>("post", `/permissions/by-role`, payload);
  }

  async updateRole(payload: any, roleId: string | undefined): Promise<void> {
    return makeRequest<void>("patch", `/permissions/${roleId}`, payload);
  }

  async deleteRole(roleId: string): Promise<void> {
    return makeRequest<void>("delete", `/permissions/${roleId}`);
  }
}

const rolesService = new RolesService();

export { rolesService };
