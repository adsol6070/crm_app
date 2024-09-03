import AsyncStorage from "@react-native-async-storage/async-storage";
import { httpClient } from "../client";
import { ResponseType } from "axios";

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

class LeadService {
  async getHistory(leadId: string) {
    return makeRequest("get", `/lead/leadHistory/${leadId}`);
  }
  async getAllLeads() {
    return makeRequest("get", "/lead/");
  }
  async getChecklistByVisaType(visaType: string) {
    return makeRequest("get", `/checklists/${visaType}`);
  }
  async getLeadById(leadId: string) {
    return makeRequest("get", `/lead/${leadId}`);
  }
  async getSpecificLeadByUserId(userId: string) {
    return makeRequest("get", `/lead/getSpecificLeads/${userId}`);
  }
  async createLead(payload: any) {
    return makeRequest("post", `/lead/createLead`, payload);
  }
  async deleteAllLeads() {
    return makeRequest("delete", `/lead/`);
  }
  async assignLead(payload: any) {
    return makeRequest("post", `/lead/leadAssignee`, payload);
  }
  async getAssigneeById(leadId: string) {
    return makeRequest("get", `/lead/leadAssignee/${leadId}`);
  }
  async updateLeadById(leadId?: string, payload?: FormData) {
    return makeRequest("patch", `/lead/${leadId}`, payload);
  }
  async updateLeadStatusById(leadId?: string, payload?: any) {
    return makeRequest("patch", `/lead/leadStatus/${leadId}`, payload);
  }
  async deleteLead(leadId: string) {
    return makeRequest<void>("delete", `/lead/${leadId}`);
  }
  async getVisaCategory() {
    return makeRequest("get", "/lead/visaCategory");
  }
  async getUploadedDocuments(leadId?: string) {
    return makeRequest("get", `/lead/getDocument/${leadId}`);
  }
  async deleteSingleDocument(leadId?: string, filename?: string) {
    return makeRequest(
      "delete",
      `/lead/getSingleDocument/${leadId}/${filename}`
    );
  }
  async getSingleDocument(leadId?: string, filename?: string) {
    return makeRequest(
      "get",
      `/lead/getSingleDocument/${leadId}/${filename}`,
      undefined,
      false,
      "blob"
    );
  }
  async getSingleDocumentUrl(leadId?: string, filename?: string) {
    return makeRequest(
      "get",
      `/lead/getSingleDocumentUrl/${leadId}/${filename}`
    );
  }
  async updateSingleDocument(
    leadId?: string,
    filename?: string,
    payload?: FormData
  ) {
    return makeRequest(
      "patch",
      `/lead/getSingleDocument/${leadId}/${filename}`,
      payload,
      true
    );
  }
  async uploadSingleDocument(leadId?: string, payload?: FormData) {
    return makeRequest("post", `/lead/uploadSingleDocument`, payload, true);
  }
}

const leadService = new LeadService();

export { leadService };
