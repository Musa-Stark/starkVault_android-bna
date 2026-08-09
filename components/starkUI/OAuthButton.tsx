import React from "react";
import { Image, ImageSourcePropType, Text } from "react-native";

import { useColor } from "@/hooks/useColor";
import { Button } from "../ui/button";

type OAuthButtonProps = {
  text: string;
  imgSource?: ImageSourcePropType;
  variant?: React.ComponentProps<typeof Button>["variant"];
  onPress: () => void;
  loading: boolean;
};

const OAuthButton = ({
  text,
  imgSource,
  variant = "outline",
  onPress,
  loading,
}: OAuthButtonProps) => {
  const foreground = useColor("foreground");

  const handleOnPress = () => {
    onPress();
  };

  return (
    <Button
      loading={loading}
      disabled={loading}
      onPress={handleOnPress}
      variant={variant}
      style={{ marginTop: 20 }}
    >
      {imgSource && (
        <Image
          source={imgSource || undefined}
          style={{
            width: 25,
            aspectRatio: 1,
            marginRight: 10,
          }}
        />
      )}

      <Text style={{ color: foreground }}>{text}</Text>
    </Button>
  );
};

export default OAuthButton;
