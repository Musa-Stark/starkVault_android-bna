import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
