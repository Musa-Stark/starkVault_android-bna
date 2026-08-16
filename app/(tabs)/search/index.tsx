import { View, Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";

const Search = () => {
  const foreground = useColor("foreground");
  return (
    <View style={{...globalStyles.globalPaddingContainer}}>
      <Text style={{ color: foreground }}>Search</Text>
    </View>
  );
};

export default Search;
