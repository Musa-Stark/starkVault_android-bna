import { View } from "react-native";
import React from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";

const notes = () => {
  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Notes
      </Text>

      <Text variant="caption">Lessons, ideas and reminders</Text>

      <Button icon={Plus} style={{ marginTop: 20 }}>
        New Note
      </Button>
    </View>
  );
};

export default notes;
