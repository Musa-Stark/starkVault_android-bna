import { View, Text, Pressable } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";
import { Href, useRouter } from "expo-router";

const AuthPrompt = ({
  prompt,
  linkText,
  route,
  onPress,
}: {
  prompt?: string;
  linkText?: string;
  route?: Href;
  onPress?: () => void;
}) => {
  const muted = useColor("textMuted");
  const foreground = useColor("foreground");
  const router = useRouter();

  const handlePress = () => {
    if (route) router.push(route);
    if (onPress) onPress();
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      {prompt && (
        <Text
          style={{
            color: muted,
            fontSize: 14,
          }}
        >
          {`${prompt} `}
        </Text>
      )}

      {linkText && (
        <Pressable hitSlop={10} onPress={handlePress}>
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
      )}
    </View>
  );
};

export default AuthPrompt;
