import { View, Text, Pressable } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const AuthPrompt = ({
  prompt,
  linkText,
  route,
}: {
  prompt: string;
  linkText: string;
  route: string;
}) => {
  const muted = useColor("textMuted");
  const foreground = useColor("foreground");

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Text
        style={{
          color: muted,
          fontSize: 14,
        }}
      >
        {`${prompt} `}
      </Text>

      <Pressable hitSlop={10} onPress={() => console.log(`Push to ${route}`)}>
        <Text
          style={{
            color: foreground,
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          {linkText}
        </Text>
      </Pressable>
    </View>
  );
};

export default AuthPrompt;
