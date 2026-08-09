import { View, Text, Image } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const AuthLogo = () => {
  const foreground = useColor("foreground");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 30,
      }}
    >
      <Image
        source={require("@/assets/images/icon.png")}
        style={{ width: 60, height: 60 }}
      />

      <Text style={{ color: foreground, fontSize: 25, fontWeight: "600" }}>
        Stark Vault
      </Text>
    </View>
  );
};

export default AuthLogo;
