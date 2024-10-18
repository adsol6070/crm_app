import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../../api/auth/index";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  tenantID?: string;
  sub?: string;
  [key: string]: any;
}

interface AuthContextProps {
  user: DecodedToken | undefined;
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
  const [user, setUser] = useState<DecodedToken | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  const setTokenExpiryTimer = (createdTime: number, expiryTime: number) => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    const timeoutDuration = (expiryTime - createdTime) * 1000;

    if (timeoutDuration > 0) {
      const timer = setTimeout(() => {
        logout();
      }, timeoutDuration);

      setLogoutTimer(timer);
    } else {
      console.warn("Token has already expired, logging out immediately.");
      logout();
    }
  };

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decodedToken = jwtDecode<DecodedToken>(storedToken);
        setUser(decodedToken);
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const login = async (data: any): Promise<string | null> => {
    try {
      const response = await authService.login(data);
      const token = response.tokens.accessToken;
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        await AsyncStorage.setItem("accessToken", token);
        setToken(token);
        setUser(decodedToken);
        setError(null);

        if (decodedToken.iat && decodedToken.exp) {
          setTokenExpiryTimer(decodedToken.iat, decodedToken.exp);
        }
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
      setUser(undefined);

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
        error,
      }}
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
