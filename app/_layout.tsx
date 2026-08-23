import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/theme/colors";
import { ThemeProvider } from "@/theme/theme-provider";
import { osName } from "expo-device";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
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
import { AuthProvider } from "@/providers/auth-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { useAuth } from "@/providers/auth-provider";

// SplashScreen.setOptions({
//   duration: 200,
//   fade: true,
// });

export default function RootLayout() {
  const colorScheme = useColorScheme() || "light";
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
  const colorScheme = useColorScheme();
  const { status } = useAuth();

  if (status === "loading") return null;

  return (
    <>
      <UploadForm />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="sheet"
          options={{
            headerShown: false,
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.4, 0.7, 1],
            contentStyle: {
              backgroundColor: isLiquidGlassAvailable()
                ? "transparent"
                : colorScheme === "dark"
                  ? Colors.dark.card
                  : Colors.light.card,
            },
            headerTransparent: Platform.OS === "ios" ? true : false,
            headerLargeTitle: false,
            title: "",
            presentation:
              Platform.OS === "ios"
                ? isLiquidGlassAvailable() && osName !== "iPadOS"
                  ? "formSheet"
                  : "modal"
                : "modal",
            sheetInitialDetentIndex: 0,
            headerStyle: {
              backgroundColor:
                Platform.OS === "ios"
                  ? "transparent"
                  : colorScheme === "dark"
                    ? Colors.dark.card
                    : Colors.light.card,
            },
            headerBlurEffect: isLiquidGlassAvailable()
              ? undefined
              : colorScheme === "dark"
                ? "dark"
                : "light",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      {status === "unauthenticated" ? (
        <Redirect href={"/(auth)/login"} />
      ) : (
        <Redirect href={"/(tabs)/dashboard"} />
      )}
      {/* <Redirect href={"/loading"} /> */}
    </>
  );
};
