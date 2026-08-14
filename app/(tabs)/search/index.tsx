import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const Search = () => {
  const foreground = useColor("foreground");
  return (
    <View>
      <Text style={{ color: foreground }}>Search</Text>
    </View>
  );
};

export default Search;
