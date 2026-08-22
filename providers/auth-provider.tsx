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

type AuthContextType = {
  status: AuthStatus;
  user: User | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  const [user, setUser] = useState<User | null>(null);

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

      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!response.ok) {
        await clearTokens();

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
      console.error("Failed to restore authentication:", error);

      await clearTokens();

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

    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
   * Login.
   */
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      console.log(response)
      throw new Error("Invalid email or password");
    }

    const data = await response.json();
    console.log(data)

    await SecureStore.setItemAsync("access_token", data.accessToken);

    await SecureStore.setItemAsync("refresh_token", data?.refreshToken);

    setUser(data.user);
    setStatus("authenticated");
  };

  /**
   * Logout.
   */
  const logout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refresh_token");

      await fetch(`${API_URL}/api/v1/auth/logout`, {
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
        login,
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
