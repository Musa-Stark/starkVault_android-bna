import { Stack } from "expo-router";
import { useColor } from "@/hooks/useColor";

export default function Layout() {
  const background = useColor("background");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: background },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
