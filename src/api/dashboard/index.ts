import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../client";
import { ResponseType } from 'axios';

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
  isMultipart: boolean = false,
  responseType?: ResponseType
): Promise<T> => {
  const headers = await getAuthHeaders(isMultipart);
  try {
    let response;
    if (method === "get" || method === "delete") {
      response = await httpClient[method](url, { headers, responseType });
    } else {
      response = await httpClient[method](url, data, { headers, responseType });
    }
    return response.data;
  } catch (error) {
    console.error(`Request Error (${method.toUpperCase()} ${url}):`, error);
    throw error;
  }
};

class DashboardService {
  async getCardsData() {
    return makeRequest("get", `/reports/getCardsData`);
  }
  async getStatusReport() {
    return makeRequest("get", `/reports/getLeadBasedOnStatus`);
  }
  async getSourceReport() {
    return makeRequest("get", `/reports/getCreatedLeadsBasedOnSource`);
  }
  async getLeadReportBasedTime(startDate: any, endDate: any) {
    return makeRequest("get", `/reports/getCreatedLeadsBasedOnTime/?startDate=${startDate}&endDate=${endDate}`);
  }
}

const dashboardService = new DashboardService();

export { dashboardService };
