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

class CRSService {
  async getAllScores() {
    return makeRequest("get", "/CRSScore/");
  }
  async saveScore(payload: any) {
    return makeRequest("post", "/CRSScore/", payload);
  }
  async deleteScoreById(scoreId: string) {
    return makeRequest("delete", `/CRSScore/${scoreId}`);
  }  
  async deleteAllScores(userId: string) {
    return makeRequest("delete", `/deleteAll/${userId}`);
  } 
}

const crsService = new CRSService();

export { crsService };
