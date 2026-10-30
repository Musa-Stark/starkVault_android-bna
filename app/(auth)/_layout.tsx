import { Stack } from "expo-router";
import { useColor } from "@/hooks/useColor";

export default function AuthLayout() {
  const background = useColor("background");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        contentStyle: { backgroundColor: background },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
