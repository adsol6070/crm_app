import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../../api/auth/index";

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  login: (data: any) => Promise<string | null>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("accessToken");
      if (storedToken) {
        setToken(storedToken);
      }
    };

    loadToken();
  }, []);

  const login = async (data: any): Promise<string | null> => {
    try {
      const response = await authService.login(data);
      const token = response.tokens.accessToken;
      if (token) {
        await AsyncStorage.setItem("accessToken", token);
        setToken(token);
        setError(null);
        return null;
      } else {
        console.error("Login Error: Token is undefined");
        setError("Login Error: Token is undefined");
        return "Login Error: Token is undefined";
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password");
      return "Invalid email or password";
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setToken(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: Boolean(token), error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
