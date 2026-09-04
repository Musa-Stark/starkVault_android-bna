import { Tabs } from "expo-router";
import { LayoutDashboard, LayoutGrid, Search, User2 } from "lucide-react-native";
import { useColor } from "@/hooks/useColor";
import { View, Text } from "react-native";

export default function Layout() {
  const background = useColor("background");
  const primary = useColor("primary");
  const muted = useColor("mutedForeground");
  const border = useColor("border");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Entire bottom navigation
        tabBarStyle: {
          height: 88,
          backgroundColor: background,
          paddingTop: 7,
          paddingBottom: 12,
          borderTopWidth: 1,
          borderTopColor: border,
          elevation: 0,
        },

        // Label
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },

        // Colors
        tabBarInactiveTintColor: muted,
        tabBarActiveTintColor: primary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? `${primary}18` : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 5,
              }}
            >
              <LayoutDashboard size={23} color={focused ? primary : muted} />
            </View>
          ),

          tabBarLabel: ({ focused }) => (
            <View>
              <Text
                style={{ color: focused ? primary : muted, fontWeight: "700", marginTop: 2, fontSize: 11 }}
              >
                Dashboard
              </Text>
            </View>
          ),

          animation: "fade",
        }}
      />
      <Tabs.Screen
        name="hub"
        options={{
          popToTopOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                borderRadius: 22,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? `${primary}18` : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 5,
              }}
            >
              <LayoutGrid size={23} color={focused ? primary : muted} />
            </View>
          ),

          tabBarLabel: ({ focused }) => (
            <View>
              <Text
                style={{ color: focused ? primary : muted, fontWeight: "700", marginTop: 2, fontSize: 11 }}
              >
                Hub
              </Text>
            </View>
          ),

          animation: "fade",
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
                backgroundColor: focused ? `${primary}18` : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 5,
              }}
            >
              <Search size={23} color={focused ? primary : muted} />
            </View>
          ),

          tabBarLabel: ({ focused }) => (
            <View>
              <Text
                style={{ color: focused ? primary : muted, fontWeight: "700", marginTop: 2, fontSize: 11 }}
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
                backgroundColor: focused ? `${primary}18` : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 5,
              }}
            >
              <User2 size={23} color={focused ? primary : muted} />
            </View>
          ),

          tabBarLabel: ({ focused }) => (
            <View>
              <Text
                style={{ color: focused ? primary : muted, fontWeight: "700", marginTop: 2, fontSize: 11 }}
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
