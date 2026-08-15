import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const AuthDivider = () => {
  const muted = useColor("mutedForeground");

  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: muted,
        }}
      />

      <Text style={{ color: muted, fontSize: 14 }}>OR</Text>

      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: muted,
        }}
      />
    </View>
  );
};

export default AuthDivider;
