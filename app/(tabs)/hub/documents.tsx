import { View } from "react-native";
import React from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react-native";

const documents = () => {
  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Documents
      </Text>

      <Text variant="caption">0 documents</Text>

      <Button icon={UploadCloud} style={{ marginTop: 20 }}>
        Upload
      </Button>
    </View>
  );
};

export default documents;
