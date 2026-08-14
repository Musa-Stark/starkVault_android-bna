import { Tabs } from "expo-router";
import {  CircleDollarSign, FolderLock, LayoutDashboard, LayoutGrid, Search, Settings, User2, Vault } from "lucide-react-native";
import { useColor } from "@/hooks/useColor";
import { View, Text } from "react-native";

export default function Layout() {
  const background = useColor("background");
  const foreground = useColor("foreground");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Entire bottom navigation
        tabBarStyle: {
          height: 100,
          backgroundColor: background,
          paddingTop: 8,
          paddingBottom: 20,
          borderTopWidth: 0,
          elevation: 10,
        },

        // Label
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },

        // Colors
        tabBarInactiveTintColor: foreground,
        tabBarActiveTintColor: foreground,
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#84d89951" : "transparent",
                paddingHorizontal: 18,
                paddingVertical: 6,
              }}
            >
              <LayoutDashboard size={24} color={foreground} />
            </View>
          ),

          tabBarLabel: () => (
            <View>
              <Text
                style={{ color: foreground, fontWeight: 600, marginTop: 2 }}
              >
                Dashboard
              </Text>
            </View>
          ),

          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="hub/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#84d89951" : "transparent",
                paddingHorizontal: 18,
                paddingVertical: 6,
              }}
            >
              <LayoutGrid size={24} color={foreground} />
            </View>
          ),

          tabBarLabel: () => (
            <View>
              <Text
                style={{ color: foreground, fontWeight: 600, marginTop: 2 }}
              >
                Hub
              </Text>
            </View>
          ),

          animation: "shift",
        }}
      />
      <Tabs.Screen
        name="search/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#84d89951" : "transparent",
                paddingHorizontal: 18,
                paddingVertical: 6,
              }}
            >
              <Search size={24} color={foreground} />
            </View>
          ),

          tabBarLabel: () => (
            <View>
              <Text
                style={{ color: foreground, fontWeight: 600, marginTop: 2 }}
              >
                Search
              </Text>
            </View>
          ),

          animation: "fade",
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#84d89951" : "transparent",
                paddingHorizontal: 18,
                paddingVertical: 6,
              }}
            >
              <User2 size={24} color={foreground} />
            </View>
          ),

          tabBarLabel: () => (
            <View>
              <Text
                style={{ color: foreground, fontWeight: 600, marginTop: 2 }}
              >
                Profile
              </Text>
            </View>
          ),

          animation: "fade",
        }}
      />
    </Tabs>
  );
}
