import { Text } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";

const Banner = ({
  heading,
  message,
  messages,
}: {
  heading?: string;
  message?: string;
  messages?: string[];
}) => {
  const foreground = useColor("foreground");
  const muted = useColor("textMuted");

  return (
    <>
      {heading && (
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
      )}

      {message && (
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
      )}

      {messages &&
        messages.map((msg, idx) => (
          <Text
            key={idx}
            style={{
              color: muted,
              fontSize: 18,
              marginTop: 5,
              textAlign: "center",
            }}
          >
            {msg}
          </Text>
        ))}
    </>
  );
};

export default Banner;
