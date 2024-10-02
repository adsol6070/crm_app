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

class BlogService {
  async getAllBlogs() {
    return makeRequest("get", "/blog/");
  }
  async createBlog(payload: FormData) {
    return makeRequest("post", "/blog/", payload, true);
  }
  async updateBlogById(blogId: string, payload: FormData) {
    return makeRequest("patch", `/blog/${blogId}`, payload, true);
  }
  async getBlogById(blogId: string) {
    return makeRequest("get", `/blog/${blogId}`);
  } 
  async deleteBlogById(blogId: string) {
    return makeRequest("delete", `/blog/${blogId}`);
  } 
  async getBlogCategory() {
    return makeRequest<any[]>("get", "/blog/blogCategory");
  }
  async createBlogCategory(payload: any) {
    return makeRequest("post", "/blog/blogCategory", payload);
  }
  async updateBlogCategory(categoryId: string, payload: any) {
    return makeRequest("patch", `/blog/blogCategory/${categoryId}`, payload);
  }
  async deleteBlogCategory(categoryId: string) {
    return makeRequest("delete", `/blog/blogCategory/${categoryId}`);
  }  
}

const blogService = new BlogService();

export { blogService };
