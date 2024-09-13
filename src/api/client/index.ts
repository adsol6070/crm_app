import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Constants from "expo-constants";

class HttpClient {
  private _httpClient: AxiosInstance;

  constructor() {
    this._httpClient = axios.create({
      baseURL: "http://192.168.1.25:8000/api/v1",
      timeout: 6000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    try {
      return await this._httpClient.get<T>(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async post<T = any>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    try {
      return await this._httpClient.post<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async patch<T = any>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    try {
      return await this._httpClient.patch<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async put<T = any>(
    url: string,
    data: any,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    try {
      return await this._httpClient.put<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    try {
      return await this._httpClient.delete<T>(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error("HTTP Client Error:", error);
  }
}

const httpClient = new HttpClient();

export { httpClient };
