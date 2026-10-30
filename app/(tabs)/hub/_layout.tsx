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
      <Stack.Screen name="expenses" />
      <Stack.Screen name="income" />
      <Stack.Screen name="savings-goals" />
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="passwords" />
      <Stack.Screen name="cards" />
      {/* <Stack.Screen name="documents" /> */}
      <Stack.Screen name="notes" />
    </Stack>
  );
}
