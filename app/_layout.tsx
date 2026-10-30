import { useColorScheme } from "@/hooks/useColorScheme";
import { useColor } from "@/hooks/useColor";
import { Colors } from "@/theme/colors";
import { ThemeProvider } from "@/theme/theme-provider";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/starkUI/StarkToast";
import UploadForm from "@/components/starkUI/upload/uploadForm";
import { AppProvider } from "@/providers/app-context";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import DeleteModal from "@/components/starkUI/DeleteModal";
import LogoutModal from "@/components/starkUI/LogoutModal";

// SplashScreen.setOptions({
//   duration: 200,
//   fade: true,
// });

export default function RootLayout() {
  const colorScheme = useColorScheme() || "light";
  const background =
    colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setStyle(
        colorScheme === "light" ? "dark" : "light",
      );
    }
  }, [colorScheme]);

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark" ? Colors.dark.background : Colors.light.background,
    );
  }, [colorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <ThemeProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} animated />
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <RootNavigator />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const RootNavigator = () => {
  const { status } = useAuth();
  const background = useColor("background");

  const screens = {
    loading: <Redirect href={"/loading"} />,
    authenticated: <Redirect href={"/dashboard"} />,
    unauthenticated: <Redirect href={"/(auth)/login"} />,
  };

  return (
    <>
      <LogoutModal   />
      <DeleteModal />
      <UploadForm />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: background },
        }}
      >
        <Stack.Screen name="loading" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      {screens[status]}
    </>
  );
};
