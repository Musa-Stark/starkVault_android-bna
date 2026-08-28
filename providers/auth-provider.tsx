import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type User = {
  _id: string;
  email: string;
  name?: string;
};

export type APIResponse = {
  success: boolean;
  message?: string;
  data?: any;
  purpose?: "login" | "signup" | "password_reset";
};

type AuthContextType = {
  status: AuthStatus;
  user: User | null;

  login: (email: string, password: string) => Promise<APIResponse>;
  signup: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<APIResponse>;
  twoFactorAuth: (
    email: string,
    otp: string,
    purpose: string,
  ) => Promise<APIResponse>;
  resendOTP: (email: string) => Promise<APIResponse>;
  forgotPassword: (email: string) => Promise<APIResponse>;
  resetPassword: (email: string, password: string) => Promise<APIResponse>;
  logout: () => Promise<void>;

  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  const [user, setUser] = useState<User | null>(null);

  const routes = {
    login: "login",
    signup: "signup",
    twoFactorAuth: "verify-otp",
    resendOTP: "resend-otp",
    forgotPassword: "forgot-password",
    resetPassword: "reset-password",
    refresh: "refresh",
    me: "me",
    logout: "logout",
  };

  /**
   * Restore authentication when the app starts.
   */
  useEffect(() => {
    restoreSession();
  }, []);

  /**
   * Restore existing session.
   */
  const restoreSession = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      if (!refreshToken) {
        setStatus("unauthenticated");
        return;
      }

      const response = await fetch(`${API_URL}/api/v1/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!response.ok) {
        // await clearTokens();

        setStatus("unauthenticated");
        return;
      }

      const data = await response.json();

      await SecureStore.setItemAsync("access_token", data.accessToken);

      /**
       * Get the current user.
       */
      await getCurrentUser();
    } catch (error) {
      console.log("Failed to restore authentication:", error);

      // await clearTokens();

      setStatus("unauthenticated");
    }
  };

  /**
   * Get current authenticated user.
   */
  const getCurrentUser = async () => {
    const accessToken = await SecureStore.getItemAsync("access_token");

    if (!accessToken) {
      setStatus("unauthenticated");
      return;
    }

    const response = await fetch(`${API_URL}/api/v1/account/${routes.me}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      await clearTokens();

      setStatus("unauthenticated");
      return;
    }

    const data = await response.json();

    setUser(data.user);
    setStatus("authenticated");
  };

  /**
   * Signup.
   */
  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const names = fullName.split(" ");
      const firstName = names[0];
      const lastName = names[1];

      const response = await fetch(`${API_URL}/api/v1/auth/${routes.signup}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || error,
      };
    }
  };

  /**
   * Login.
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/${routes.login}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || error,
      };
    }
  };

  /**
   * 2fa
   */
  const twoFactorAuth = async (email: string, otp: string, purpose: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/${routes.twoFactorAuth}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            purpose,
          }),
        },
      );

      const data = await response.json();

      if (data.purpose === "password_reset") return data;

      await SecureStore.setItemAsync("access_token", data?.accessToken);

      await SecureStore.setItemAsync("refresh_token", data?.refreshToken);

      setUser(data.user);
      setStatus("authenticated");

      return data;
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || error,
      };
    }
  };

  /**
   * resendOTP
   */
  const resendOTP = async (email: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/${routes.resendOTP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || error,
      };
    }
  };

  /**
   * forgotPassword
   */
  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/${routes.forgotPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        },
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || error,
      };
    }
  };

  /**
   * Login.
   */
  const resetPassword = async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/auth/${routes.resetPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      return data;
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message || error,
      };
    }
  };

  /**
   * Logout.
   */
  const logout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("reerrorfresh_token");

      await fetch(`${API_URL}/api/v1/auth/${routes.logout}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: refreshToken
          ? JSON.stringify({
              refreshToken,
            })
          : undefined,
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      await clearTokens();

      setUser(null);
      setStatus("unauthenticated");
    }
  };

  /**
   * Clear local authentication.
   */

  const clearTokens = async () => {
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        signup,
        login,
        twoFactorAuth,
        resendOTP,
        forgotPassword,
        resetPassword,
        logout,
        refreshSession: restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
