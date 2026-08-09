import { Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const Banner = ({ heading, message }: { heading: string; message: string }) => {
  const foreground = useColor("foreground");
  const muted = useColor("textMuted");

  return (
    <>
      <Text
        style={{
          color: foreground,
          fontSize: 33,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {heading}
      </Text>

      <Text
        style={{
          color: muted,
          fontSize: 18,
          marginTop: 5,
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </>
  );
};

export default Banner;
