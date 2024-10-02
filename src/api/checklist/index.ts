import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../client";

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

class ChecklistService {
  async getAllChecklist() {
    return makeRequest<any[]>("get", "/checklists/");
  }
  async createChecklist(payload: any) {
    return makeRequest("post", "/checklists/", payload);
  }
  async updateChecklistById(checklistId: string, payload: any) {
    return makeRequest("patch", `/checklists/${checklistId}`, payload);
  }
  async deleteChecklistById(checklistId: string) {
    return makeRequest("delete", `/checklists/${checklistId}`);
  }
  async getChecklistByVisaType(visaType: string) {
    return makeRequest("get", `/checklists/${visaType}`);
  }
}

const checklistService = new ChecklistService();

export { checklistService };
