import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const Money = () => {
  const foreground = useColor("foreground");
  return (
    <View>
      <Text style={{ color: foreground }}>Money</Text>
    </View>
  );
};

export default Money;
