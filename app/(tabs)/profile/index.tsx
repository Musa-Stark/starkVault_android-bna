import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const Profile = () => {
  const foreground = useColor("foreground");
  return (
    <View>
      <Text style={{ color: foreground }}>Profile</Text>
    </View>
  );
};

export default Profile;
