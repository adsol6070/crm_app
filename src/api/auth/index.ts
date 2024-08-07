import { httpClient } from "../client";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: {
    username: string;
    email: string;
  };
}

class AuthService {
  async register(payload: FormData): Promise<any> {
    try {
      const response = await httpClient.post<any>("/auth/register", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>(
        "/auth/login",
        payload
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error("AuthService Error:", error);
  }
}

const authService = new AuthService();

export { authService };
