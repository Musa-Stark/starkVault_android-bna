import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const DashBoard = () => {
  const foreground = useColor("foreground");
  return (
    <View>
      <Text style={{ color: foreground }}>DashBoard</Text>
    </View>
  );
};

export default DashBoard;
