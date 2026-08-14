import { View } from "react-native";
import React from "react";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import VisaCard from "@/components/starkUI/VisaCard";
import MasterCard from "./MasterCard";
import AmericanExpress from "./AmericanExpress";
import PakistaniCnicCard from "./CNIC";
import SadapayCard from "./Sadapay";

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

      {/* <VisaCard /> */}
      {/* <MasterCard /> */}
      {/* <PakistaniCnicCard/> */}
      {/* <AmericanExpress/> */}
      <SadapayCard />
    </View>
  );
};

export default cards;
