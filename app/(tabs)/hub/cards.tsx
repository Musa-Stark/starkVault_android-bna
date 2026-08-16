import { View } from "react-native";
import React from "react";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";

const cards = () => {
  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Cards
      </Text>

      <Text variant="caption">0 cards in vault</Text>

      <Button icon={Plus} style={{ marginTop: 20 }}>
        Add Card
      </Button>
    </View>
  );
};

export default cards;
