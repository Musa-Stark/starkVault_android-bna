import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const Vault = () => {
  const foreground = useColor("foreground");
  return (
    <View>
      <Text style={{ color: foreground }}>Vault</Text>
    </View>
  );
};

export default Vault;
